import { useEffect, useState } from 'react';
import { FieldValidator } from './field-validator';
import { ValidationContext } from './validation-context';
import { Field } from './validation-field';
import { ValidationError } from './validator';

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
  const [errors, setErrors] = useState<ValidationError[]>([]);
  useEffect(() => validateTouched(), [touched]);
  const validateTouched = () => {
    const validationErrors = props.validators
      .filter((v) => touched.includes(v.field))
      .filter((v) => v.isApplicable(props.editing))
      .filter((v) => !v.isValid(props.editing))
      .map((v) => v.error);
    // want to ignore prior state:
    setErrors(validationErrors);
  };
  // addToTouched and localDispatch get passed down via context
  const addToTouched = (fieldName: Field): void => {
    setTouched((state) => [...state, fieldName]);
  };
  const validate = (): boolean => {
    const validationErrors = props.validators
      // submit means everything is touched
      .filter((v) => v.isApplicable(props.editing))
      .filter((v) => !v.isValid(props.editing))
      .map((v) => v.error);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  return (
    <ValidationContext.Provider
      value={{
        touch: addToTouched,
        validateForm: validate,
        getErrors: () => [...errors],
      }}
    >
      {props.children}
    </ValidationContext.Provider>
  );
};
