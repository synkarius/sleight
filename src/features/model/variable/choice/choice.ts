import { getRandomId } from '../../../../util/random-id';
import { RoleKeyed, Ided, Named, Typed, BasicFields } from '../../../domain';
import { copyVariable } from '../variable';
import { VariableType } from '../variable-types';

export interface ChoiceItem extends RoleKeyed, Ided {
  readonly selectorId: string;
  readonly value: string;
}

export const createChoiceItem = (selectorId: string): ChoiceItem => {
  return {
    roleKeyId: null,
    id: getRandomId(),
    selectorId: selectorId,
    value: '',
  };
};

export interface Choice
  extends RoleKeyed,
    Named,
    Ided,
    Typed<VariableType.Type> {
  readonly type: typeof VariableType.Enum.CHOICE;
  readonly items: ChoiceItem[];
}

export const createChoice = (selectorId: string): Choice => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.CHOICE,
    name: '',
    roleKeyId: null,
    items: [createChoiceItem(selectorId)],
  };
};

export const copyIntoChoice = (
  variable: BasicFields<VariableType.Type>,
  selectorId: string
): Choice => {
  return {
    ...copyVariable(variable),
    type: VariableType.Enum.CHOICE,
    items: [createChoiceItem(selectorId)],
  };
};

export type EditChoiceItemValuePayload = {
  readonly choiceItemId: string;
  readonly value: string;
};

export type RemoveChoiceItemPayload = {
  readonly choiceItemId: string;
};

export type ChangeVariableTypePayload = {
  readonly variableType: VariableType.Type;
  readonly selectorId: string | null;
};
