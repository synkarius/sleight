import { AbstractAction } from '../abstract-action';
import { ActionType } from '../action-types';
import {
  NumericActionValue,
  TextActionValue,
} from '../action-value/action-value';
import { MouseActionType } from './mouse-action-type';
import { MouseMovementType } from './mouse-movement-type';

interface AbstractMouseAction extends AbstractAction {
  readonly type: typeof ActionType.Enum.MOUSE;
  readonly mouseActionType: MouseActionType.Type;
}

interface MoveMouseAction extends AbstractMouseAction {
  readonly mouseActionType: typeof MouseActionType.Enum.MOVE;
  readonly mouseMovementType: MouseMovementType.Type;
  readonly x: number;
  readonly y: number;
}

interface AbstractButtonMouseAction extends AbstractMouseAction {
  readonly mouseActionType:
    | typeof MouseActionType.Enum.PRESS
    | typeof MouseActionType.Enum.HOLD_RELEASE;
  // TODO: change this to an EnumActionValue
  readonly mouseKey: TextActionValue;
  readonly pause: NumericActionValue;
}

interface PressMouseAction extends AbstractButtonMouseAction {
  readonly mouseActionType: typeof MouseActionType.Enum.PRESS;
  readonly repeat: NumericActionValue;
}

interface HoldReleaseMouseAction extends AbstractButtonMouseAction {
  readonly mouseActionType: typeof MouseActionType.Enum.PRESS;
  // TODO: change this to an EnumActionValue
  readonly direction: TextActionValue;
}

export type MouseAction =
  | MoveMouseAction
  | PressMouseAction
  | HoldReleaseMouseAction;
