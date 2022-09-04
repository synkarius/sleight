import { FieldValidator } from '../field-validator';
import { Action } from '../../ui/model/action/action';
import { Command } from '../../ui/model/command/command';
import {
  getActionSideSpecAdequacyValidator,
  getCommandSideSpecAdequacyValidator,
  getSpecSideSpecAdequacyValidator,
} from '../../ui/model/command/spec-adequacy-cross-slice-validator';
import { Context } from '../../ui/model/context/context';
import { Spec } from '../../ui/model/spec/data/spec-domain';
import { Variable } from '../../ui/model/variable/data/variable';
import {
  getSpecItemOptionalityValidator,
  getVariableOptionalityValidator,
} from '../../ui/model/variable/optionality-cross-slice-validator';

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
