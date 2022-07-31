import { createEditingContext } from '../common/editing-context';
import { MoveDirection } from '../common/move-direction';
import { Selector, SelectorItem } from '../selector/data/selector-domain';
import { SpecItem } from './data/spec-domain';
import { SpecItemType } from './spec-item-type';

export enum SpecReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  ADD_SPEC_ITEM,
  CHANGE_SPEC_ITEM_TYPE,
  CHANGE_SPEC_ITEM_VARIABLE_ID,
  CHANGE_SPEC_ITEM_ORDER,
  DELETE_SPEC_ITEM,
  ADD_SELECTOR_ITEM,
  CHANGE_SELECTOR_ITEM,
  DELETE_SELECTOR_ITEM,
}

interface AbstractSpecReducerAction<T> {
  type: SpecReducerActionType;
  payload: T;
}

export interface SpecReducerStringAction
  extends AbstractSpecReducerAction<string> {
  type:
    | typeof SpecReducerActionType.CHANGE_NAME
    | typeof SpecReducerActionType.CHANGE_ROLE_KEY
    | typeof SpecReducerActionType.DELETE_SPEC_ITEM;
}
export interface SpecReducerAddAction
  extends AbstractSpecReducerAction<SpecItem> {
  type: typeof SpecReducerActionType.ADD_SPEC_ITEM;
}
export interface SpecReducerChangeSpecItemTypeAction
  extends AbstractSpecReducerAction<ChangeSpecItemTypePayload> {
  type: typeof SpecReducerActionType.CHANGE_SPEC_ITEM_TYPE;
}
export interface SpecReducerChangeSpecItemVariableIdAction
  extends AbstractSpecReducerAction<ChangeSpecItemVariableIdPayload> {
  type: typeof SpecReducerActionType.CHANGE_SPEC_ITEM_VARIABLE_ID;
}
export interface SpecReducerChangeSpecItemOrderAction
  extends AbstractSpecReducerAction<ChangeSpecItemOrderPayload> {
  type: typeof SpecReducerActionType.CHANGE_SPEC_ITEM_ORDER;
}
export interface SpecReducerAddSelectorItemAction
  extends AbstractSpecReducerAction<AddSelectorItemPayload> {
  type: typeof SpecReducerActionType.ADD_SELECTOR_ITEM;
}
export interface SpecReducerChangeSelectorItemAction
  extends AbstractSpecReducerAction<ChangeSelectorItemPayload> {
  type: typeof SpecReducerActionType.CHANGE_SELECTOR_ITEM;
}
export interface SpecReducerDeleteSelectorItemAction
  extends AbstractSpecReducerAction<DeleteSelectorItemPayload> {
  type: typeof SpecReducerActionType.DELETE_SELECTOR_ITEM;
}
export type SpecReducerAction =
  | SpecReducerStringAction
  | SpecReducerAddAction
  | SpecReducerChangeSpecItemTypeAction
  | SpecReducerChangeSpecItemVariableIdAction
  | SpecReducerChangeSpecItemOrderAction
  | SpecReducerAddSelectorItemAction
  | SpecReducerChangeSelectorItemAction
  | SpecReducerDeleteSelectorItemAction;

export const SpecEditingContext = createEditingContext<SpecReducerAction>();

interface AbstractChangeSpecItemTypePayload {
  readonly specItemId: string;
  readonly specItemType: SpecItemType.Type;
}

export interface ChangeSpecItemTypeToSelectorPayload
  extends AbstractChangeSpecItemTypePayload {
  readonly specItemType: typeof SpecItemType.Enum.SELECTOR;
  readonly selector: Selector;
}

export interface ChangeSpecItemTypeToVariablePayload
  extends AbstractChangeSpecItemTypePayload {
  readonly specItemType: typeof SpecItemType.Enum.VARIABLE;
  readonly variableId: string;
}

export type ChangeSpecItemTypePayload =
  | ChangeSpecItemTypeToSelectorPayload
  | ChangeSpecItemTypeToVariablePayload;

export type ChangeSpecItemVariableIdPayload = {
  readonly specItemId: string;
  readonly variableId: string;
};

export type ChangeSpecItemOrderPayload = {
  readonly specItemId: string;
  readonly moveDirection: MoveDirection;
};

export type AddSelectorItemPayload = {
  readonly specItemId: string;
  readonly selectorItem: SelectorItem;
};

export type ChangeSelectorItemPayload = {
  readonly specItemId: string;
  readonly selectorItemId: string;
  readonly value: string;
};

export type DeleteSelectorItemPayload = {
  readonly specItemId: string;
  readonly selectorItemId: string;
};
