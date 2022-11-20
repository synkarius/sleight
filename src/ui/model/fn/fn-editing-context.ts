import { createEditingContext } from '../../../core/common/editing-context';
import { MoveDirection } from '../../../core/common/move-direction';
import { FnParameter } from '../../../data/model/fn/fn';
import { FnType } from '../../../data/model/fn/fn-types';
import { VariableType } from '../../../data/model/variable/variable-types';

export enum FnReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_TYPE,
  CHANGE_IMPORT_PATH,
  ADD_PARAMETER,
  MOVE_PARAMETER,
  DELETE_PARAMETER,
  CHANGE_PARAMETER_NAME,
  CHANGE_PARAMETER_TYPE,
  TOGGLE_ENABLED,
  TOGGLE_LOCKED,
}

type ParameterPayload<T> = {
  id: string;
  value: T;
};

type MoveParameterPayload = {
  index: number;
  direction: MoveDirection;
};

type AbstractFnReducerAction<T> = {
  type: FnReducerActionType;
  payload: T;
};

export interface FnReducerStringAction extends AbstractFnReducerAction<string> {
  type:
    | typeof FnReducerActionType.CHANGE_NAME
    | typeof FnReducerActionType.CHANGE_ROLE_KEY
    | typeof FnReducerActionType.CHANGE_IMPORT_PATH;
}

export interface FnReducerAddParamAction
  extends AbstractFnReducerAction<FnParameter> {
  type: typeof FnReducerActionType.ADD_PARAMETER;
}

export interface FnReducerMoveParamAction
  extends AbstractFnReducerAction<MoveParameterPayload> {
  type: typeof FnReducerActionType.MOVE_PARAMETER;
}

export interface FnReducerNumberAction extends AbstractFnReducerAction<number> {
  type: typeof FnReducerActionType.DELETE_PARAMETER;
}

export interface FnReducerParamNameAction
  extends AbstractFnReducerAction<ParameterPayload<string>> {
  type: typeof FnReducerActionType.CHANGE_PARAMETER_NAME;
}

export interface FnReducerParamTypeAction
  extends AbstractFnReducerAction<ParameterPayload<VariableType.Type>> {
  type: typeof FnReducerActionType.CHANGE_PARAMETER_TYPE;
}

export interface FnReducerTypeAction
  extends AbstractFnReducerAction<FnType.Type> {
  type: typeof FnReducerActionType.CHANGE_TYPE;
}

interface FnReducerToggleAction
  extends Omit<AbstractFnReducerAction<unknown>, 'payload'> {
  type:
    | typeof FnReducerActionType.TOGGLE_ENABLED
    | typeof FnReducerActionType.TOGGLE_LOCKED;
}

export type FnReducerAction =
  | FnReducerStringAction
  | FnReducerNumberAction
  | FnReducerAddParamAction
  | FnReducerMoveParamAction
  | FnReducerParamNameAction
  | FnReducerParamTypeAction
  | FnReducerTypeAction
  | FnReducerToggleAction;

export const FnEditingContext = createEditingContext<FnReducerAction>();
