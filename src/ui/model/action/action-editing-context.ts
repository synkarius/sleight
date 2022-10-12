import { Field } from '../../../validation/validation-field';
import { createEditingContext } from '../../../core/common/editing-context';
import { ActionType } from '../../../data/model/action/action-types';
import { ActionValueType } from '../../../data/model/action/action-value-type';
import { MouseActionType } from '../../../data/model/action/mouse/mouse-action-type';
import { MouseMovementType } from '../../../data/model/action/mouse/mouse-movement-type';
import { SendKeyMode } from '../../../data/model/action/send-key/send-key-modes';
import { SendKeyModifiers } from '../../../data/model/action/send-key/send-key-modifiers';

export enum ActionReducerActionType {
  CHANGE_ACTION_TYPE,
  CHANGE_ACTION_VALUE_ENTERED_VALUE,
  CHANGE_ACTION_VALUE_TYPE,
  CHANGE_ACTION_VALUE_VARIABLE_ID,
  CHANGE_MODIFIERS,
  CHANGE_FN,
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_SEND_KEY_MODE,
  CHANGE_MOUSE_ACTION_TYPE,
  CHANGE_MOUSE_MOVEMENT_TYPE,
  TOGGLE_ENABLED,
  TOGGLE_LOCKED,
}

type AbstractActionReducerAction<T> = {
  type: ActionReducerActionType;
  payload: T;
};
//====== payloads:
type ActionValueChange = {
  field: Field;
  value: string;
};
type ActionValueTypeChange = {
  field: Field;
  actionValueType: ActionValueType.Type;
};
//====== reducer actions:
export interface ActionReducerStringPayloadAction
  extends AbstractActionReducerAction<string> {
  type:
    | typeof ActionReducerActionType.CHANGE_NAME
    | typeof ActionReducerActionType.CHANGE_ROLE_KEY
    | typeof ActionReducerActionType.CHANGE_FN;
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
export interface ActionReducerMouseActionTypePayloadAction
  extends AbstractActionReducerAction<MouseActionType.Type> {
  type: typeof ActionReducerActionType.CHANGE_MOUSE_ACTION_TYPE;
}
export interface ActionReducerMouseMovementTypePayloadAction
  extends AbstractActionReducerAction<MouseMovementType.Type> {
  type: typeof ActionReducerActionType.CHANGE_MOUSE_MOVEMENT_TYPE;
}
// change action value: value/variable
export interface ActionReducerChangePayloadAction
  extends AbstractActionReducerAction<ActionValueChange> {
  type:
    | typeof ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE
    | typeof ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID;
}
export interface ActionReducerToggleAction
  extends Omit<AbstractActionReducerAction<unknown>, 'payload'> {
  type:
    | typeof ActionReducerActionType.TOGGLE_ENABLED
    | typeof ActionReducerActionType.TOGGLE_LOCKED;
}
export type ActionReducerAction =
  | ActionReducerStringPayloadAction
  | ActionReducerActionTypePayloadAction
  | ActionReducerActionValueTypePayloadAction
  | ActionReducerSendKeyModePayloadAction
  | ActionReducerModifiersPayloadAction
  | ActionReducerChangePayloadAction
  | ActionReducerMouseActionTypePayloadAction
  | ActionReducerMouseMovementTypePayloadAction
  | ActionReducerToggleAction;

export const ActionEditingContext = createEditingContext<ActionReducerAction>();
