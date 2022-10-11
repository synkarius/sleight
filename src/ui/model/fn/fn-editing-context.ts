import { createEditingContext } from '../../../core/common/editing-context';
import { FnParameter } from '../../../data/model/fn/fn';
import { FnType } from '../../../data/model/fn/fn-types';
import { VariableType } from '../../../data/model/variable/variable-types';

export enum FnReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_TYPE,
  CHANGE_IMPORT_PATH,
  ADD_PARAMETER,
  CHANGE_PARAMETER_NAME,
  CHANGE_PARAMETER_TYPE,
  TOGGLE_ENABLED,
  TOGGLE_LOCKED,
}

type ParameterPayload<T> = {
  id: string;
  value: T;
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

export interface FnReducerToggleAction
  extends Omit<AbstractFnReducerAction<unknown>, 'payload'> {
  type:
    | typeof FnReducerActionType.TOGGLE_ENABLED
    | typeof FnReducerActionType.TOGGLE_LOCKED;
}

export type FnReducerAction =
  | FnReducerStringAction
  | FnReducerAddParamAction
  | FnReducerParamNameAction
  | FnReducerParamTypeAction
  | FnReducerTypeAction
  | FnReducerToggleAction;

export const FnEditingContext = createEditingContext<FnReducerAction>();
