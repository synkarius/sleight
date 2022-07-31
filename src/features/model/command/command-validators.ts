import { isSelected } from '../../../util/common-functions';
import {
  createValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { Command } from './command';
import { CommandSpecType } from './command-spec-type';

export const commandSpecVariableSelectedValidator: FieldValidator<Command> =
  createValidator(
    Field.CMD_SPEC_VAR,
    (command) => CommandSpecType.Enum.VARIABLE === command.specType,
    (command) => isSelected(command.specVariableId),
    ValidationErrorCode.CMD_SPEC_VAR_NOT_SELECTED,
    'spec variable must be selected'
  );

export const commandSpecRoleKeySelectedValidator: FieldValidator<Command> =
  createValidator(
    Field.CMD_SPEC_RK,
    (command) => CommandSpecType.Enum.ROLE_KEY === command.specType,
    (command) => isSelected(command.specRoleKeyId),
    ValidationErrorCode.CMD_SPEC_RK_NOT_SELECTED,
    'spec role key must be selected'
  );