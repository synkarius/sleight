import { createEditingContext } from '../common/editing-context';
import { Selector, SelectorItem } from '../selector/data/selector-domain';
import { ChoiceItem } from './data/variable';
import { VariableType } from './variable-types';

export enum VariableReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_TYPE,
  CHANGE_RANGE_MIN,
  CHANGE_RANGE_MAX,
  ADD_CHOICE_ITEM,
  EDIT_CHOICE_ITEM,
  DELETE_CHOICE_ITEM,
  ADD_SELECTOR_ITEM,
  EDIT_SELECTOR_ITEM,
  DELETE_SELECTOR_ITEM,
}

interface AbstractVariableReducerAction<T> {
  readonly type: VariableReducerActionType;
  readonly payload: T;
}

export interface VariableReducerStringAction
  extends AbstractVariableReducerAction<string> {
  readonly type:
    | typeof VariableReducerActionType.CHANGE_NAME
    | typeof VariableReducerActionType.CHANGE_ROLE_KEY
    | typeof VariableReducerActionType.DELETE_CHOICE_ITEM;
}

export interface VariableReducerVariableTypeAction
  extends AbstractVariableReducerAction<ChangeVariableTypePayload> {
  readonly type: typeof VariableReducerActionType.CHANGE_TYPE;
}

export interface VariableReducerNumberAction
  extends AbstractVariableReducerAction<number> {
  readonly type:
    | typeof VariableReducerActionType.CHANGE_RANGE_MIN
    | typeof VariableReducerActionType.CHANGE_RANGE_MAX;
}

export interface VariableReducerAddChoiceItemAction
  extends AbstractVariableReducerAction<ChoiceItem> {
  readonly type: typeof VariableReducerActionType.ADD_CHOICE_ITEM;
}

export interface VariableReducerEditChoiceItemAction
  extends AbstractVariableReducerAction<EditChoiceItemValuePayload> {
  readonly type: typeof VariableReducerActionType.EDIT_CHOICE_ITEM;
}

export interface VariableReducerAddSelectorItemAction
  extends AbstractVariableReducerAction<AddSelectorItemPayload> {
  readonly type: typeof VariableReducerActionType.ADD_SELECTOR_ITEM;
}

export interface VariableReducerChangeSelectorItemAction
  extends AbstractVariableReducerAction<ChangeSelectorItemPayload> {
  readonly type: typeof VariableReducerActionType.EDIT_SELECTOR_ITEM;
}

export interface VariableReducerDeleteSelectorItemAction
  extends AbstractVariableReducerAction<DeleteSelectorItemPayload> {
  readonly type: typeof VariableReducerActionType.DELETE_SELECTOR_ITEM;
}

export type VariableReducerAction =
  | VariableReducerStringAction
  | VariableReducerVariableTypeAction
  | VariableReducerNumberAction
  | VariableReducerAddChoiceItemAction
  | VariableReducerEditChoiceItemAction
  | VariableReducerAddSelectorItemAction
  | VariableReducerChangeSelectorItemAction
  | VariableReducerDeleteSelectorItemAction;

export const VariableEditingContext =
  createEditingContext<VariableReducerAction>();

// ===================

export interface AbstractChangeVariableTypePayload {
  readonly variableType: VariableType.Type;
}

export interface ChangeVariableTypeSimplePayload
  extends AbstractChangeVariableTypePayload {
  readonly variableType:
    | typeof VariableType.Enum.TEXT
    | typeof VariableType.Enum.RANGE;
}

export interface ChangeVariableTypeSelectorPayload
  extends AbstractChangeVariableTypePayload {
  readonly variableType: typeof VariableType.Enum.CHOICE;
  readonly selector: Selector;
}

export type ChangeVariableTypePayload =
  | ChangeVariableTypeSimplePayload
  | ChangeVariableTypeSelectorPayload;

export type EditChoiceItemValuePayload = {
  readonly choiceItemId: string;
  readonly value: string;
};

export type AddSelectorItemPayload = {
  readonly choiceItemId: string;
  readonly selectorItem: SelectorItem;
};

export type ChangeSelectorItemPayload = {
  readonly choiceItemId: string;
  readonly selectorItemId: string;
  readonly value: string;
};

export type DeleteSelectorItemPayload = {
  readonly choiceItemId: string;
  readonly selectorItemId: string;
};