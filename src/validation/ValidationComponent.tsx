import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { useAllDataSelector } from '../data/use-all-data-selector';
import { ExhaustivenessFailureError } from '../error/exhaustiveness-failure-error';
import { listsIntersect } from '../util/common-functions';
import { FieldValidator, ValidatorType } from './field-validator';
import { ValidationContext } from './validation-context';
import { Field } from './validation-field';
import {
  ErrorValidationResult,
  ValidationResultType,
} from './validation-result';

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

const isTouched = (
  validator: FieldValidator<any>,
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
const shouldUseValidator = (
  mode: ValidateMode,
  validator: FieldValidator<any>,
  touched: Field[]
): boolean => {
  const isDeletionValidator =
    validator.validatorType === ValidatorType.FIELD &&
    validator.exclusiveValidationMode === ValidateMode.DELETE;
  switch (mode) {
    case ValidateMode.DELETE:
      return isDeletionValidator;
    case ValidateMode.SUBMIT:
      return !isDeletionValidator;
    case ValidateMode.TOUCH:
      return !isDeletionValidator && isTouched(validator, touched);
    default:
      throw new ExhaustivenessFailureError(mode);
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
  const [results, setResults] = useState<ErrorValidationResult[]>([]);
  useEffect(() => validateTouched(), [touched]);
  const allData = useAllDataSelector();
  const validate = (mode: ValidateMode): ErrorValidationResult[] => {
    // submit means everything is touched
    return props.validators
      .filter((v) => shouldUseValidator(mode, v, touched))
      .filter((v) => v.isApplicable(props.editing))
      .map((v) => v.validate(props.editing, allData))
      .filter(
        (result): result is ErrorValidationResult =>
          result.type !== ValidationResultType.VALID
      );
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
