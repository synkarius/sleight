import { getRandomId } from '../util/random-id';

export interface ValidationError {
  readonly errorId: string;
  readonly message: string;
}

export const createValidationError = (message: string): ValidationError => {
  return {
    errorId: getRandomId(),
    message,
  };
};

export interface Validator<T> {
  readonly test: (t: T) => boolean;
  readonly error: ValidationError;
}

/**
 * Id-based indexOf method to work with redux-toolkit proxies.
 * @param errors
 * @param error
 * @returns
 */
const indexOfError = (
  errors: ValidationError[],
  error: ValidationError
): number => {
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].errorId === error.errorId) {
      return i;
    }
  }
  return -1;
};

const includesError = (errors: ValidationError[], error: ValidationError) => {
  return indexOfError(errors, error) != -1;
};

/**
 * Validates a `T`. If the `validator`'s test fails, the `validator`'s error
 * is added to `errors`. If the `validator`'s test passes, the `validator`'s
 * error is removed from `errors`.
 * @param t
 * @param validator
 * @param errors
 */
export const validate = <T>(
  t: T,
  validator: Validator<T>,
  errors: ValidationError[]
): void => {
  if (validator.test(t)) {
    while (includesError(errors, validator.error)) {
      const index = indexOfError(errors, validator.error);
      errors.splice(index, 1);
    }
  } else {
    if (!includesError(errors, validator.error)) {
      errors.push(validator.error);
    }
  }
};

/**
 * To be used in tsx files to get the error message where
 * multiple validators apply.
 * @param allErrors
 * @param validators
 * @returns
 */
export const getRelevantErrorMessage = (
  allErrors: ValidationError[],
  validators: (Validator<any> | undefined)[]
): string | undefined => {
  for (let i = 0; i < validators.length; i++) {
    if (validators[i]) {
      const validator = validators[i] as Validator<any>;
      if (allErrors.includes(validator.error)) {
        return validator.error.message;
      }
    }
  }
  return undefined;
};
