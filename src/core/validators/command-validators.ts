import {
  alwaysTrue,
  isDefined,
  isIdSelected,
} from '../common/common-functions';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import { ValidatorType } from '../../validation/field-validator';
import {
  createRoleKeyTakenValidator,
  createValidator,
} from '../../validation/validator-factories';
import { Command } from '../../data/model/command/command';
import {
  ValidationResultType,
  validResult,
} from '../../validation/validation-result';
import { OptionalId } from '../../data/model/domain';
import { UNSELECTED_ID } from '../common/consts';

const roleKeyTakenValidator = createRoleKeyTakenValidator<Command, Command>(
  Field.CMD_ROLE_KEY,
  (data) => data.commands,
  'a command already exists with this role key',
  ValidationErrorCode.CMD_RK_TAKEN
);

const specSelectedValidator: FieldValidator<Command> = createValidator(
  Field.CMD_SPEC_SELECT,
  alwaysTrue,
  (command) => isIdSelected(command.specId),
  ValidationErrorCode.CMD_SPEC_VAR_NOT_SELECTED,
  'spec must be selected'
);

const mapContextId = (contextId: OptionalId): OptionalId => {
  return contextId ?? UNSELECTED_ID;
};

const specUniquenessValidator: FieldValidator<Command> = {
  validatorType: ValidatorType.FIELDS,
  fields: [Field.CMD_CONTEXT, Field.CMD_SPEC_SELECT],
  isApplicable: alwaysTrue,
  validate: (command, data) => {
    const duplicate = Object.values(data.commands)
      .filter((c) => c.id !== command.id)
      .filter((commandDTO) => {
        return (
          commandDTO.specId === command.specId &&
          mapContextId(commandDTO.contextId) === mapContextId(command.contextId)
        );
      })
      .find(isDefined);
    return !duplicate
      ? validResult(Field.CMD_SPEC_SELECT)
      : {
          type: ValidationResultType.BASIC,
          errorHighlightField: Field.CMD_SPEC_SELECT,
          code: ValidationErrorCode.CMD_SPEC_NOT_UNIQUE,
          message:
            'commands must have unique specs per context, but this spec is used in command ' +
            ` "${duplicate.name}"`,
        };
  },
};

export const getCommandValidators: () => FieldValidator<Command>[] = () => [
  roleKeyTakenValidator,
  specSelectedValidator,
  specUniquenessValidator,
];
