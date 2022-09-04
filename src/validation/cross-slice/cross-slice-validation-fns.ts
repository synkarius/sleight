import { FieldValidator } from '../field-validator';
import { Action } from '../../features/model/action/action';
import { Command } from '../../features/model/command/command';
import {
  getActionSideSpecAdequacyValidator,
  getCommandSideSpecAdequacyValidator,
  getSpecSideSpecAdequacyValidator,
} from '../../features/model/command/spec-adequacy-cross-slice-validator';
import { Context } from '../../features/model/context/context';
import { Spec } from '../../features/model/spec/data/spec-domain';
import { Variable } from '../../features/model/variable/data/variable';
import {
  getSpecItemOptionalityValidator,
  getVariableOptionalityValidator,
} from '../../features/model/variable/optionality-cross-slice-validator';

// Some validations have to be run cross-slice. This file is a place to keep those organized.

export const getCrossSliceActionValidators = (): FieldValidator<Action>[] => [
  getActionSideSpecAdequacyValidator(),
];
export const getCrossSliceCommandValidators = (): FieldValidator<Command>[] => [
  getCommandSideSpecAdequacyValidator(),
];
export const getCrossSliceContextValidators =
  (): FieldValidator<Context>[] => [];
export const getCrossSliceSpecValidators = (): FieldValidator<Spec>[] => [
  getSpecSideSpecAdequacyValidator(),
  getSpecItemOptionalityValidator(),
];
export const getCrossSliceVariableValidators =
  (): FieldValidator<Variable>[] => [getVariableOptionalityValidator()];
