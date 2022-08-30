import { FieldValidator } from '../validation/field-validator';
import { Action } from './model/action/action';
import { Command } from './model/command/command';
import {
  getActionSideSpecAdequacyValidator,
  getCommandSideSpecAdequacyValidator,
  getSpecSideSpecAdequacyValidator,
} from './model/command/spec-adequacy-cross-slice-validator';
import { Context } from './model/context/context';
import { RoleKey } from './model/role-key/role-key';
import { Spec } from './model/spec/data/spec-domain';
import { Variable } from './model/variable/data/variable';
import {
  getSpecItemOptionalityValidator,
  getVariableOptionalityValidator,
} from './model/variable/optionality-cross-slice-validator';

// Some validations have to be run cross-slice. This file is a place to keep those organized.

export const getCrossSliceActionValidators = (): FieldValidator<Action>[] => [
  getActionSideSpecAdequacyValidator(),
];
export const getCrossSliceCommandValidators = (): FieldValidator<Command>[] => [
  getCommandSideSpecAdequacyValidator(),
];
export const getCrossSliceContextValidators =
  (): FieldValidator<Context>[] => [];
export const getCrossSliceRoleKeyValidators =
  (): FieldValidator<RoleKey>[] => [];
export const getCrossSliceSpecValidators = (): FieldValidator<Spec>[] => [
  getSpecSideSpecAdequacyValidator(),
  getSpecItemOptionalityValidator(),
];
export const getCrossSliceVariableValidators =
  (): FieldValidator<Variable>[] => [getVariableOptionalityValidator()];
