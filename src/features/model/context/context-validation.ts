import { Validator } from '../../../validation/validator';

export enum ContextValidationError {
  MATCHER_IS_BLANK = "matcher can't be blank",
}

export const contextMatcherValidator: Validator<
  string,
  ContextValidationError
> = {
  test: (matcher) => matcher.trim().length > 0,
  error: ContextValidationError.MATCHER_IS_BLANK,
};
