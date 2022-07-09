import { notEmpty } from '../../../validation/common-validations';
import {
  createValidationError,
  Validator,
} from '../../../validation/validator';

export const roleKeyTextValidator: Validator<string> = {
  test: notEmpty,
  error: createValidationError("role key can't be empty"),
};
