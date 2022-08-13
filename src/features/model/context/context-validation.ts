import { alwaysTrue, notEmpty } from '../../../util/common-functions';
import {
  createValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { Context } from './context';

const contextMatcherValidator: FieldValidator<Context> = createValidator(
  Field.CTX_MATCHER,
  alwaysTrue,
  (context) => notEmpty(context.matcher),
  ValidationErrorCode.CTX_MATCHER_EMPTY,
  "matcher can't be empty"
);

export const contextValidators = [contextMatcherValidator];
