import { alwaysTrue, isIdSelected } from '../common/common-functions';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import {
  createNameTakenValidator,
  createRoleKeyTakenValidator,
  createValidator,
} from '../../validation/validator-factories';
import { Command } from '../../data/model/command/command';

const nameTakenValidator = createNameTakenValidator<Command, Command>(
  Field.CMD_NAME,
  (data) => data.commands,
  'a command already exists with this name',
  ValidationErrorCode.CMD_NAME_TAKEN
);

const roleKeyTakenValidator = createRoleKeyTakenValidator<Command, Command>(
  Field.CMD_ROLE_KEY,
  (data) => data.commands,
  'a command already exists with this role key',
  ValidationErrorCode.CMD_RK_TAKEN
);

const commandSpecVariableSelectedValidator: FieldValidator<Command> =
  createValidator(
    Field.CMD_SPEC_SELECT,
    alwaysTrue,
    (command) => isIdSelected(command.specId),
    ValidationErrorCode.CMD_SPEC_VAR_NOT_SELECTED,
    'spec variable must be selected'
  );

export const getCommandValidators: () => FieldValidator<Command>[] = () => [
  // nameTakenValidator,
  roleKeyTakenValidator,
  commandSpecVariableSelectedValidator,
];
