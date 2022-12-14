import { FieldValidator } from '../field-validator';
import { Action } from '../../data/model/action/action';
import { Command } from '../../data/model/command/command';
import {
  getActionSideSpecAdequacyValidator,
  getCommandSideSpecAdequacyValidator,
  getSpecSideSpecAdequacyValidator,
} from '../../core/validators/spec-adequacy-cross-slice-validator';
import { Context } from '../../data/model/context/context';
import { Spec } from '../../data/model/spec/spec-domain';
import { Variable } from '../../data/model/variable/variable';
import {
  getSpecItemOptionalityValidator,
  getVariableOptionalityValidator,
} from '../../core/validators/optionality-cross-slice-validator';
import {
  getRangeSuitabilityActionValidator,
  getRangeSuitabilityVariableValidator,
} from '../../core/validators/range-suitability-cross-slice-validator';

// Some validations have to be run cross-slice.

// TODO: do proper DI for all of these

export const getCrossSliceActionValidators = (): FieldValidator<Action>[] => [
  getActionSideSpecAdequacyValidator(),
  getRangeSuitabilityActionValidator(),
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
  (): FieldValidator<Variable>[] => [
    getVariableOptionalityValidator(),
    getRangeSuitabilityVariableValidator(),
  ];
