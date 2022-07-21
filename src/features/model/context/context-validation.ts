import { notEmpty } from '../../../util/common-functions';
import {
  createValidationError,
  Validator,
} from '../../../validation/validator';

export const contextMatcherValidator: Validator<string> = {
  isValid: notEmpty,
  error: createValidationError("matcher can't be empty"),
};
