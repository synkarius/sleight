import { RoleKeyed, Ided, Named, Typed, BasicFields } from '../../../domain';
import { copyVariable, createVariable } from '../variable';
import { VariableType } from '../variable-types';

const BEGIN_INCLUSIVE_DEFAULT = 0;
const END_INCLUSIVE_DEFAULT = 9;

export interface Range extends RoleKeyed, Named, Ided, Typed<string> {
  beginInclusive: number;
  endInclusive: number;
}

export const createRange = (): Range => {
  return {
    ...createVariable(VariableType.RANGE),
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};

export const copyIntoRange = (variable: BasicFields<string>): Range => {
  return {
    ...copyVariable(variable),
    type: VariableType.RANGE,
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};
