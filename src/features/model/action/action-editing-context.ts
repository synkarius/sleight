import { Field } from '../../../validation/validation-field';
import { createEditingContext } from '../common/editing-context';
import { ActionType } from './action-types';
import { ActionValueType } from './action-value/action-value-type';
import { SendKeyMode } from './send-key/send-key-modes';
import { SendKeyModifiers } from './send-key/send-key-modifiers';

// TODO: enum values
export enum ActionReducerActionType {
  CHANGE_ACTION_TYPE,
  CHANGE_ACTION_VALUE_ENTERED_VALUE,
  CHANGE_ACTION_VALUE_ROLE_KEY_ID,
  CHANGE_ACTION_VALUE_TYPE,
  CHANGE_ACTION_VALUE_VARIABLE_ID,
  CHANGE_MODIFIERS,
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_SEND_KEY_MODE,
}

type AbstractActionReducerAction<T> = {
  type: ActionReducerActionType;
  payload: T;
};
// for action values, fill in later
type ActionValueChange = {
  field: Field;
  value: string;
};
type ActionValueTypeChange = {
  field: Field;
  actionValueType: ActionValueType.Type;
};

export interface ActionReducerStringPayloadAction
  extends AbstractActionReducerAction<string> {
  type:
    | typeof ActionReducerActionType.CHANGE_NAME
    | typeof ActionReducerActionType.CHANGE_ROLE_KEY;
}
export interface ActionReducerActionTypePayloadAction
  extends AbstractActionReducerAction<ActionType.Type> {
  type: typeof ActionReducerActionType.CHANGE_ACTION_TYPE;
}
export interface ActionReducerActionValueTypePayloadAction
  extends AbstractActionReducerAction<ActionValueTypeChange> {
  type: typeof ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE;
}
export interface ActionReducerSendKeyModePayloadAction
  extends AbstractActionReducerAction<SendKeyMode.Type> {
  type: typeof ActionReducerActionType.CHANGE_SEND_KEY_MODE;
}
export interface ActionReducerModifiersPayloadAction
  extends AbstractActionReducerAction<SendKeyModifiers> {
  type: typeof ActionReducerActionType.CHANGE_MODIFIERS;
}
// change action value: value/variable/roleKey
export interface ActionReducerChangePayloadAction
  extends AbstractActionReducerAction<ActionValueChange> {
  type:
    | typeof ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE
    | typeof ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID
    | typeof ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID;
}
export type ActionReducerAction =
  | ActionReducerStringPayloadAction
  | ActionReducerActionTypePayloadAction
  | ActionReducerActionValueTypePayloadAction
  | ActionReducerSendKeyModePayloadAction
  | ActionReducerModifiersPayloadAction
  | ActionReducerChangePayloadAction;

export const ActionEditingContext = createEditingContext<ActionReducerAction>();
