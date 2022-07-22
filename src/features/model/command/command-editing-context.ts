import { createEditingContext } from '../common/editing-context';
import { MoveDirection } from '../common/move-direction';

export enum CommandReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_SPEC_TYPE,
  CHANGE_SPEC_VARIABLE_ID,
  CHANGE_SPEC_ROLE_KEY_ID,
  ADD_ACTION,
  CHANGE_ACTION,
  MOVE_ACTION,
  DELETE_ACTION,
}

export type ChangeCommandActionId = {
  index: number;
  newActionId: string;
};

export type MoveCommandAction = {
  index: number;
  direction: MoveDirection;
};

type AbstractCommandReducerAction<T> = {
  type: CommandReducerActionType;
  payload: T;
};

export type CommandReducerStringAction = AbstractCommandReducerAction<string>;
export type CommandReducerActionIdAction =
  AbstractCommandReducerAction<ChangeCommandActionId>;
export type CommandReducerMoveAction =
  AbstractCommandReducerAction<MoveCommandAction>;
export type CommandReducerDeleteAction = AbstractCommandReducerAction<number>;
export type CommandReducerAction =
  | CommandReducerStringAction
  | CommandReducerActionIdAction
  | CommandReducerMoveAction
  | CommandReducerDeleteAction;

export const CommandEditingContext =
  createEditingContext<CommandReducerAction>();
