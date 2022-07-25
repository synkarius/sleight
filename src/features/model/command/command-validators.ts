import { isSelected } from '../../../util/common-functions';
import {
  createFieldValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { Field } from '../../../validation/validation-field';
import { createValidationError } from '../../../validation/validator';
import { Command } from './command';
import { CommandSpecType } from './command-spec-type';

export const commandSpecVariableSelectedValidator: FieldValidator<Command> =
  createFieldValidator(
    Field.CMD_SPEC_VAR,
    (command) => CommandSpecType.Enum.VARIABLE === command.specType,
    (command) => isSelected(command.specVariableId),
    createValidationError('spec variable must be selected')
  );

export const commandSpecRoleKeySelectedValidator: FieldValidator<Command> =
  createFieldValidator(
    Field.CMD_SPEC_RK,
    (command) => CommandSpecType.Enum.ROLE_KEY === command.specType,
    (command) => isSelected(command.specRoleKeyId),
    createValidationError('spec role key must be selected')
  );
