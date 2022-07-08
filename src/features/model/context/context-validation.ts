import { Validator } from '../../../validation/validator';

export enum ContextValidationError {
  MATCHER_IS_EMPTY = "matcher can't be empty",
}

export const contextMatcherValidator: Validator<
  string,
  ContextValidationError
> = {
  test: (matcher) => matcher.trim().length > 0,
  error: ContextValidationError.MATCHER_IS_EMPTY,
};
