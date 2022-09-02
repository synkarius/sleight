import { alwaysTrue, notEmpty } from '../../../util/common-functions';
import {
  createNameTakenValidator,
  createValidator,
  FieldValidator,
  ValidatorType,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import { ValidateMode } from '../../../validation/ValidationComponent';
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

const deletionValidator: FieldValidator<Context> = {
  validatorType: ValidatorType.FIELD,
  exclusiveValidationMode: ValidateMode.DELETE,
  field: Field.CTX_DELETE,
  isApplicable: alwaysTrue,
  validate: (context, data) => {
    const commandsUsingContext = Object.values(data.commands)
      .filter((command) => command.contextId === context.id)
      .map((command) => command.name);
    const commandsStr = commandsUsingContext.join('", "');
    return commandsUsingContext.length === 0
      ? validResult(Field.CTX_DELETE)
      : {
          type: ValidationResultType.BASIC,
          field: Field.CTX_DELETE,
          code: ValidationErrorCode.CTX_USED_AND_DELETE_ATTEMPTED,
          message:
            'cannot delete: this context is used in command(s):' +
            ` "${commandsStr}"`,
        };
  },
};

export const getContextValidators: () => FieldValidator<Context>[] = () => [
  nameTakenValidator,
  contextMatcherValidator,
  deletionValidator,
];
