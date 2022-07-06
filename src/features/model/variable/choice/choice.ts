import { getRandomId } from '../../../../util/functions';
import { RoleKeyed, Ided, Named, Typed, BasicFields } from '../../../domain';
import { copyVariable, createVariable } from '../variable';
import { VariableType } from '../variable-types';

export interface ChoiceItem extends RoleKeyed, Ided {
  selectorId: string;
  value: string;
}

export const createChoiceItem = (selectorId: string): ChoiceItem => {
  return {
    roleKeyId: null,
    id: getRandomId(),
    selectorId: selectorId,
    value: '',
  };
};

export interface Choice extends RoleKeyed, Named, Ided, Typed {
  items: ChoiceItem[];
}

export const createChoice = (selectorId: string): Choice => {
  return {
    ...createVariable(VariableType.CHOICE),
    items: [createChoiceItem(selectorId)],
  };
};

export const copyIntoChoice = (
  variable: BasicFields,
  selectorId: string
): Choice => {
  return {
    ...copyVariable(variable),
    type: VariableType.CHOICE,
    items: [createChoiceItem(selectorId)],
  };
};

export type EditChoiceItemSelectorPayload = {
  choiceItemId: string;
  selector: string;
};

export type EditChoiceItemValuePayload = {
  choiceItemId: string;
  value: string;
};

export type RemoveChoiceItemPayload = {
  choiceItemId: string;
};

export type ChangeVariableTypePayload = {
  variableType: string;
  selectorId: string | null;
};
