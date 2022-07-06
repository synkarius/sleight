import {
  RoleKeyed,
  copyVariable,
  createVariable,
  Ided,
  Named,
  Typed,
} from '../../../domain';
import { VariableType } from '../variable-types';

export interface Text extends RoleKeyed, Named, Ided, Typed {}

interface TextCompatible extends RoleKeyed, Named, Ided, Typed {}

export const createText = (): Text => {
  return {
    ...createVariable(VariableType.TEXT),
  };
};

export const copyIntoText = (variable: TextCompatible): Text => {
  return {
    ...copyVariable(variable),
    type: VariableType.TEXT,
  };
};
