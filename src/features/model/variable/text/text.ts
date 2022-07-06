import { RoleKeyed, Ided, Named, Typed, BasicFields } from '../../../domain';
import { copyVariable, createVariable } from '../variable';
import { VariableType } from '../variable-types';

export interface Text extends RoleKeyed, Named, Ided, Typed {}

export const createText = (): Text => {
  return {
    ...createVariable(VariableType.TEXT),
  };
};

export const copyIntoText = (variable: BasicFields): Text => {
  return {
    ...copyVariable(variable),
    type: VariableType.TEXT,
  };
};
