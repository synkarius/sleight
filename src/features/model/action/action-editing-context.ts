import { Field } from '../../../validation/validation-field';
import { createEditingContext } from '../common/editing-context';
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
export type ActionReducerStringPayloadAction =
  AbstractActionReducerAction<string>;
export type ActionReducerModifiersPayloadAction =
  AbstractActionReducerAction<SendKeyModifiers>;
export type ActionReducerChangePayloadAction =
  AbstractActionReducerAction<ActionValueChange>;
export type ActionReducerAction =
  | ActionReducerStringPayloadAction
  | ActionReducerModifiersPayloadAction
  | ActionReducerChangePayloadAction;

export const ActionEditingContext = createEditingContext<ActionReducerAction>();
