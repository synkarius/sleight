import { useEffect, useState } from 'react';
import { useAllData } from '../app/custom-hooks/use-all-data-hook';
import { ExhaustivenessFailureError } from '../error/exhaustiveness-failure-error';
import { listsIntersect } from '../core/common/common-functions';
import {
  FieldValidator,
  isDeletionValidator,
  ValidatorType,
} from './field-validator';
import {
  ErrorOrFailureValidationResult,
  isErrorOrFailedValidationResult,
  ValidationContext,
} from './validation-context';
import { Field } from './validation-field';
import { ValidationResult, ValidationResultType } from './validation-result';
import { SleightDataInternalFormat } from '../data/data-formats';

export enum ValidateMode {
  TOUCH,
  SUBMIT,
  DELETE,
}

// generic props
type ValidationProps<E> = {
  children: React.ReactNode;
  validators: FieldValidator<E>[];
  editing: E;
};
type ValidationPropsComponent = <E>(
  props: ValidationProps<E>
) => React.ReactElement<ValidationProps<E>>;

const isTouched = <E,>(
  validator: FieldValidator<E>,
  touched: Field[]
): boolean => {
  const validatorType = validator.validatorType;
  switch (validatorType) {
    case ValidatorType.FIELD:
      return touched.includes(validator.field);
    case ValidatorType.FIELDS:
      return listsIntersect(validator.fields, touched);
    default:
      throw new ExhaustivenessFailureError(validatorType);
  }
};

/**
 * when a validator can be used:
 * - mode: touch -> any except delete, but only if touched
 * - mode: submit -> any except delete
 * - mode: delete -> delete validators only
 */
const shouldUseValidator = <E,>(
  mode: ValidateMode,
  validator: FieldValidator<E>,
  touched: Field[]
): boolean => {
  switch (mode) {
    case ValidateMode.DELETE:
      return isDeletionValidator(validator);
    case ValidateMode.SUBMIT:
      return !isDeletionValidator(validator);
    case ValidateMode.TOUCH:
      return !isDeletionValidator(validator) && isTouched(validator, touched);
    default:
      throw new ExhaustivenessFailureError(mode);
  }
};

/**
 * Attempts a validation.
 */
const tryValidate = <T,>(
  validator: FieldValidator<T>,
  editing: T,
  data: Readonly<SleightDataInternalFormat>
): ValidationResult => {
  try {
    return validator.validate(editing, data);
  } catch (error) {
    const field =
      validator.validatorType === ValidatorType.FIELDS
        ? validator.fields[0]
        : validator.field;
    return {
      type: ValidationResultType.VALIDATION_FAILED,
      errorHighlightField: field,
      message: `validation failed for ${Field[field]}`,
    };
  }
};

/**
 * Controls local validation.
 *
 * Must specify domain object type being validated.
 *
 * Provides to children:
 * - touch fn
 * - validate form fn
 * - validation errors
 */
export const ValidationComponent: ValidationPropsComponent = (props) => {
  const [touched, setTouched] = useState<Field[]>([]);
  const [results, setResults] = useState<ErrorOrFailureValidationResult[]>([]);
  useEffect(() => validateTouched(), [touched]);
  const allData = useAllData();
  const validate = (mode: ValidateMode): ErrorOrFailureValidationResult[] => {
    // submit means everything is touched
    return props.validators
      .filter((v) => shouldUseValidator(mode, v, touched))
      .filter((v) => v.isApplicable(props.editing))
      .map((v) => tryValidate(v, props.editing, allData))
      .filter(isErrorOrFailedValidationResult);
  };
  const validateTouched = () => {
    // want to ignore prior state:
    setResults(validate(ValidateMode.TOUCH));
  };
  // addToTouched and localDispatch get passed down via context
  const addToTouched = (fieldName: Field): void => {
    setTouched((state) => [...state, fieldName]);
  };

  const validateOnSubmit = (): boolean => {
    const errorResults = validate(ValidateMode.SUBMIT);
    setResults(errorResults);
    return errorResults.length === 0;
  };

  return (
    <ValidationContext.Provider
      value={{
        touch: addToTouched,
        validateForSave: validateOnSubmit,
        validateForDelete: () => validate(ValidateMode.DELETE),
        getErrorResults: () => [...results],
      }}
    >
      {props.children}
    </ValidationContext.Provider>
  );
};
