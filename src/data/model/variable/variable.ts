import { getRandomId } from '../../../core/common/random-id';
import { Enablable, Ided, Lockable, Named, RoleKeyed, Typed } from '../domain';
import { Selector } from '../selector/selector-domain';
import { VariableType } from './variable-types';

export interface AbstractVariable
  extends Enablable,
    Ided,
    Lockable,
    Named,
    RoleKeyed,
    Typed<VariableType.Type> {}

export interface TextVariable extends AbstractVariable {
  readonly type: typeof VariableType.Enum.TEXT;
  readonly defaultValue?: string;
}

export const isTextVariable = (
  variable: AbstractVariable
): variable is TextVariable => variable.type === VariableType.Enum.TEXT;

export interface RangeVariable extends AbstractVariable {
  readonly type: typeof VariableType.Enum.NUMBER;
  readonly beginInclusive: number;
  readonly endInclusive: number;
  readonly defaultValue?: number;
}

export const isRangeVariable = (
  variable: AbstractVariable
): variable is RangeVariable => variable.type === VariableType.Enum.NUMBER;

export interface ChoiceItem extends Ided {
  readonly selector: Selector;
  readonly value: string;
}

export interface ChoiceVariable extends AbstractVariable {
  readonly type: typeof VariableType.Enum.ENUM;
  readonly items: ChoiceItem[];
  readonly defaultValue?: string;
}

export const isChoiceVariable = (
  variable: AbstractVariable
): variable is ChoiceVariable => variable.type === VariableType.Enum.ENUM;

export type Variable = TextVariable | RangeVariable | ChoiceVariable;

const BEGIN_INCLUSIVE_DEFAULT = 0;
const END_INCLUSIVE_DEFAULT = 9;

// ============= convenience "create" methods

export const createTextVariable = (): TextVariable => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.TEXT,
    name: '',
    roleKey: '',
    enabled: true,
    locked: false,
  };
};

export const createRangeVariable = (): RangeVariable => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.NUMBER,
    name: '',
    roleKey: '',
    enabled: true,
    locked: false,
    beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
    endInclusive: END_INCLUSIVE_DEFAULT,
  };
};

export const createChoiceItem = (selector: Selector): ChoiceItem => {
  return {
    id: getRandomId(),
    selector: selector,
    value: '',
  };
};

export const createChoiceVariable = (): ChoiceVariable => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.ENUM,
    name: '',
    roleKey: '',
    enabled: true,
    locked: false,
    items: [],
  };
};
