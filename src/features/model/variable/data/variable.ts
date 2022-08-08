import { getRandomId } from '../../../../util/random-id';
import { Ided, Named, RoleKeyed, Typed } from '../../../domain';
import { Selector } from '../../selector/data/selector-domain';
import { VariableType } from '../variable-types';

export interface AbstractVariable
  extends Ided,
    Named,
    RoleKeyed,
    Typed<VariableType.Type> {}

export interface TextVariable extends AbstractVariable {
  readonly type: typeof VariableType.Enum.TEXT;
}

export interface RangeVariable extends AbstractVariable {
  readonly type: typeof VariableType.Enum.RANGE;
  readonly beginInclusive: number;
  readonly endInclusive: number;
}

export const isRangeVariable = (
  variable: AbstractVariable
): variable is RangeVariable => variable.type === VariableType.Enum.RANGE;

export interface ChoiceItem extends RoleKeyed, Ided {
  readonly selector: Selector;
  readonly value: string;
}

export interface ChoiceVariable extends AbstractVariable {
  readonly type: typeof VariableType.Enum.CHOICE;
  readonly items: ChoiceItem[];
}

export const isChoiceVariable = (
  variable: AbstractVariable
): variable is ChoiceVariable => variable.type === VariableType.Enum.CHOICE;

export type Variable = TextVariable | RangeVariable | ChoiceVariable;

const BEGIN_INCLUSIVE_DEFAULT = 0;
const END_INCLUSIVE_DEFAULT = 9;

// ============= convenience "create" methods

export const createTextVariable = (): TextVariable => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.TEXT,
    name: '',
    roleKeyId: undefined,
  };
};

export const createRangeVariable = (): RangeVariable => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.RANGE,
    name: '',
    roleKeyId: undefined,
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};

export const createChoiceItem = (selector: Selector): ChoiceItem => {
  return {
    roleKeyId: undefined,
    id: getRandomId(),
    selector: selector,
    value: '',
  };
};

export const createChoiceVariable = (): ChoiceVariable => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.CHOICE,
    name: '',
    roleKeyId: undefined,
    items: [],
  };
};
