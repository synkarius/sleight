import { alwaysTrue } from '../../../common/common-functions';
import {
  createNameTakenValidator,
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
import { Action } from './action';

const nameTakenValidator = createNameTakenValidator<Action, Action>(
  Field.AC_NAME,
  (data) => data.actions,
  'an action already exists with this name',
  ValidationErrorCode.AC_NAME_TAKEN
);

const deletionValidator: FieldValidator<Action> = {
  validatorType: ValidatorType.FIELD,
  exclusiveValidationMode: ValidateMode.DELETE,
  field: Field.AC_DELETE,
  isApplicable: alwaysTrue,
  validate: (action, data) => {
    const commandsUsingAction = Object.values(data.commands)
      .filter((command) => command.actionIds.includes(action.id))
      .map((command) => command.name);
    const actionsStr = commandsUsingAction.join('", "');
    return commandsUsingAction.length === 0
      ? validResult(Field.AC_DELETE)
      : {
          type: ValidationResultType.BASIC,
          field: Field.AC_DELETE,
          code: ValidationErrorCode.AC_USED_AND_DELETE_ATTEMPTED,
          message:
            'cannot delete: this action is used in command(s):' +
            ` "${actionsStr}"`,
        };
  },
};

export const getActionValidators: () => FieldValidator<Action>[] = () => [
  nameTakenValidator,
  deletionValidator,
];
