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
// TODO: what is this used for? -- probably name
export type ActionReducerStringPayloadAction =
  AbstractActionReducerAction<string>;
export type ActionReducerActionTypePayloadAction =
  AbstractActionReducerAction<ActionType.Type>;
// change action value type
export type ActionReducerActionValueTypePayloadAction =
  AbstractActionReducerAction<ActionValueTypeChange>;
// change send key mode
export type ActionReducerSendKeyModePayloadAction =
  AbstractActionReducerAction<SendKeyMode.Type>;
// change modifiers
export type ActionReducerModifiersPayloadAction =
  AbstractActionReducerAction<SendKeyModifiers>;
// change action value: value/variable/roleKey
export type ActionReducerChangePayloadAction =
  AbstractActionReducerAction<ActionValueChange>;
export type ActionReducerAction =
  | ActionReducerStringPayloadAction
  | ActionReducerActionTypePayloadAction
  | ActionReducerActionValueTypePayloadAction
  | ActionReducerSendKeyModePayloadAction
  | ActionReducerModifiersPayloadAction
  | ActionReducerChangePayloadAction;

export const ActionEditingContext = createEditingContext<ActionReducerAction>();
