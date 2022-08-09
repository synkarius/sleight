import { createEditingContext } from '../common/editing-context';
import { MoveDirection } from '../common/move-direction';
import { CommandSpecType } from './command-spec-type';

export enum CommandReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_CONTEXT,
  CHANGE_SPEC_TYPE,
  CHANGE_SPEC_VARIABLE_ID,
  CHANGE_SPEC_ROLE_KEY_ID,
  ADD_ACTION,
  CHANGE_ACTION,
  MOVE_ACTION,
  DELETE_ACTION,
}

type ChangeCommandActionId = {
  index: number;
  newActionId: string;
};

type MoveCommandAction = {
  index: number;
  direction: MoveDirection;
};

type AbstractCommandReducerAction<T> = {
  type: CommandReducerActionType;
  payload: T;
};

export interface CommandReducerStringAction
  extends AbstractCommandReducerAction<string> {
  type:
    | typeof CommandReducerActionType.CHANGE_NAME
    | typeof CommandReducerActionType.CHANGE_ROLE_KEY
    | typeof CommandReducerActionType.CHANGE_CONTEXT
    | typeof CommandReducerActionType.CHANGE_SPEC_VARIABLE_ID
    | typeof CommandReducerActionType.CHANGE_SPEC_ROLE_KEY_ID
    | typeof CommandReducerActionType.ADD_ACTION;
}
export interface CommandReducerSpecTypeAction
  extends AbstractCommandReducerAction<CommandSpecType.Type> {
  type: typeof CommandReducerActionType.CHANGE_SPEC_TYPE;
}
export interface CommandReducerActionIdAction
  extends AbstractCommandReducerAction<ChangeCommandActionId> {
  type: typeof CommandReducerActionType.CHANGE_ACTION;
}
export interface CommandReducerMoveAction
  extends AbstractCommandReducerAction<MoveCommandAction> {
  type: typeof CommandReducerActionType.MOVE_ACTION;
}
export interface CommandReducerDeleteAction
  extends AbstractCommandReducerAction<number> {
  type: typeof CommandReducerActionType.DELETE_ACTION;
}
export type CommandReducerAction =
  | CommandReducerStringAction
  | CommandReducerSpecTypeAction
  | CommandReducerActionIdAction
  | CommandReducerMoveAction
  | CommandReducerDeleteAction;

export const CommandEditingContext =
  createEditingContext<CommandReducerAction>();
