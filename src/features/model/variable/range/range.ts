import {
  RoleKeyed,
  copyVariable,
  createVariable,
  Ided,
  Named,
  Typed,
} from '../../../domain';
import { VariableType } from '../variable-types';

const BEGIN_INCLUSIVE_DEFAULT = 0;
const END_INCLUSIVE_DEFAULT = 9;

export interface Range extends RoleKeyed, Named, Ided, Typed {
  beginInclusive: number;
  endInclusive: number;
}

interface RangeCompatible extends RoleKeyed, Named, Ided, Typed {}

export const createRange = (): Range => {
  return {
    ...createVariable(VariableType.RANGE),
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};

export const copyIntoRange = (variable: RangeCompatible): Range => {
  return {
    ...copyVariable(variable),
    type: VariableType.RANGE,
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};
