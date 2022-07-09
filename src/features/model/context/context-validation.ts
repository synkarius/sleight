import { notEmpty } from '../../../validation/common-validations';
import {
  createValidationError,
  Validator,
} from '../../../validation/validator';

export const contextMatcherValidator: Validator<string> = {
  test: notEmpty,
  error: createValidationError("matcher can't be empty"),
};
