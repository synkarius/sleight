import { alwaysTrue, notEmpty } from '../../../util/common-functions';
import {
  createNameTakenValidator,
  createValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { Context } from './context';

const nameTakenValidator = createNameTakenValidator<Context, Context>(
  Field.CTX_NAME,
  (data) => data.contexts,
  'a context already exists with this name',
  ValidationErrorCode.CTX_NAME_TAKEN
);

const contextMatcherValidator: FieldValidator<Context> = createValidator(
  Field.CTX_MATCHER,
  alwaysTrue,
  (context) => notEmpty(context.matcher),
  ValidationErrorCode.CTX_MATCHER_EMPTY,
  "matcher can't be empty"
);

export const getContextValidators: () => FieldValidator<Context>[] = () => [
  nameTakenValidator,
  contextMatcherValidator,
];
