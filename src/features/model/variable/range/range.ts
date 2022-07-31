import { getRandomId } from '../../../../util/random-id';
import { RoleKeyed, Ided, Named, Typed, BasicFields } from '../../../domain';
import { copyVariable } from '../variable';
import { VariableType } from '../variable-types';

const BEGIN_INCLUSIVE_DEFAULT = 0;
const END_INCLUSIVE_DEFAULT = 9;

export interface Range
  extends RoleKeyed,
    Named,
    Ided,
    Typed<VariableType.Type> {
  readonly type: typeof VariableType.Enum.RANGE;
  readonly beginInclusive: number;
  readonly endInclusive: number;
}

export const createRange = (): Range => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.RANGE,
    name: '',
    roleKeyId: undefined,
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};

export const copyIntoRange = (
  variable: BasicFields<VariableType.Type>
): Range => {
  return {
    ...copyVariable(variable),
    type: VariableType.Enum.RANGE,
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};
