import {
  AbstractAction,
  copyAction,
  createAbstractAction,
} from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import {
  createEnumValue,
  createNumericValue,
  EnumActionValue,
  NumericActionValue,
} from '../action-value';
import { MouseActionType } from './mouse-action-type';
import { MouseMovementType } from './mouse-movement-type';

interface AbstractMouseAction extends AbstractAction {
  readonly type: typeof ActionType.Enum.MOUSE;
  readonly mouseActionType: MouseActionType.Type;
}

export const isMouseAction = (action: Action): action is MouseAction =>
  action.type === ActionType.Enum.MOUSE;

export interface MoveMouseAction extends AbstractMouseAction {
  readonly mouseActionType: typeof MouseActionType.Enum.MOVE;
  readonly mouseMovementType: MouseMovementType.Type;
  readonly x: NumericActionValue;
  readonly y: NumericActionValue;
}

export const isMoveMouseAction = (
  action: MouseAction
): action is MoveMouseAction =>
  action.mouseActionType === MouseActionType.Enum.MOVE;

interface AbstractButtonMouseAction extends AbstractMouseAction {
  readonly mouseActionType:
    | typeof MouseActionType.Enum.CLICK
    | typeof MouseActionType.Enum.HOLD_RELEASE;
  readonly mouseButton: EnumActionValue;
  readonly pause: NumericActionValue;
}

export interface ClickMouseAction extends AbstractButtonMouseAction {
  readonly mouseActionType: typeof MouseActionType.Enum.CLICK;
  readonly repeat: NumericActionValue;
}

export const isClickMouseAction = (
  action: MouseAction
): action is ClickMouseAction =>
  action.mouseActionType === MouseActionType.Enum.CLICK;

export interface HoldReleaseMouseAction extends AbstractButtonMouseAction {
  readonly mouseActionType: typeof MouseActionType.Enum.HOLD_RELEASE;
  readonly direction: EnumActionValue;
}

export const isHoldReleaseMouseAction = (
  action: MouseAction
): action is HoldReleaseMouseAction =>
  action.mouseActionType === MouseActionType.Enum.HOLD_RELEASE;

export type MouseAction =
  | MoveMouseAction
  | ClickMouseAction
  | HoldReleaseMouseAction;

//===============

export const createMouseMoveAction = (): MoveMouseAction => ({
  ...createAbstractAction(),
  type: ActionType.Enum.MOUSE,
  mouseActionType: MouseActionType.Enum.MOVE,
  mouseMovementType: MouseMovementType.Enum.ABSOLUTE_PIXELS,
  x: createNumericValue(),
  y: createNumericValue(),
});

export const copyIntoMouseMoveAction = (action: Action): MouseAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.MOUSE,
    mouseActionType: MouseActionType.Enum.MOVE,
    mouseMovementType: MouseMovementType.Enum.ABSOLUTE_PIXELS,
    x: createNumericValue(),
    y: createNumericValue(),
  };
};

export const createMouseClickAction = (): ClickMouseAction => {
  return {
    ...createAbstractAction(),
    type: ActionType.Enum.MOUSE,
    mouseActionType: MouseActionType.Enum.CLICK,
    mouseButton: createEnumValue(),
    pause: createNumericValue(),
    repeat: createNumericValue(),
  };
};

export const copyIntoMouseClickAction = (action: Action): ClickMouseAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.MOUSE,
    mouseActionType: MouseActionType.Enum.CLICK,
    mouseButton: createEnumValue(),
    pause: createNumericValue(),
    repeat: createNumericValue(),
  };
};

export const createMouseHoldAction = (): HoldReleaseMouseAction => {
  return {
    ...createAbstractAction(),
    type: ActionType.Enum.MOUSE,
    mouseActionType: MouseActionType.Enum.HOLD_RELEASE,
    mouseButton: createEnumValue(),
    pause: createNumericValue(),
    direction: createEnumValue(),
  };
};

export const copyIntoMouseHoldAction = (
  action: Action
): HoldReleaseMouseAction => {
  return {
    ...copyAction(action),
    type: ActionType.Enum.MOUSE,
    mouseActionType: MouseActionType.Enum.HOLD_RELEASE,
    mouseButton: createEnumValue(),
    pause: createNumericValue(),
    direction: createEnumValue(),
  };
};
