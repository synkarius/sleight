import { alwaysTrue, notEmpty } from '../../../util/common-functions';
import {
  createFieldValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { Field } from '../../../validation/validation-field';
import { createValidationError } from '../../../validation/validator';
import { Context } from './context';

export const contextMatcherValidator: FieldValidator<Context> =
  createFieldValidator(
    Field.CTX_MATCHER,
    alwaysTrue,
    (context) => notEmpty(context.matcher),
    createValidationError("matcher can't be empty")
  );
