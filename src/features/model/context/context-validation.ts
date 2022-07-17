import { notEmptyPredicate } from '../../../validation/common-validations';
import {
  createValidationError,
  Validator,
} from '../../../validation/validator';

export const contextMatcherValidator: Validator<string> = {
  isValid: notEmptyPredicate,
  error: createValidationError("matcher can't be empty"),
};
