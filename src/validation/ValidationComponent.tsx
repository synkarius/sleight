import { useEffect, useState } from 'react';
import { FieldValidator } from './field-validator';
import { ValidationContext } from './validation-context';
import { Field } from './validation-field';
import {
  ErrorValidationResult,
  ValidationResultType,
} from './validation-result';

enum ValidateMode {
  SUBMIT,
  TOUCH,
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
  const validate = (mode: ValidateMode): ErrorValidationResult[] => {
    // submit means everything is touched
    return props.validators
      .filter((v) => mode === ValidateMode.SUBMIT || touched.includes(v.field))
      .filter((v) => v.isApplicable(props.editing))
      .map((v) => v.validate(props.editing))
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
        validateForm: validateOnSubmit,
        getErrorResults: () => [...results],
      }}
    >
      {props.children}
    </ValidationContext.Provider>
  );
};
