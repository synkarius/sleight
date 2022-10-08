import { createEditingContext } from '../../../core/common/editing-context';
import { FnType } from '../../../data/model/fn/fn-types';

export enum FnReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_TYPE,
  TOGGLE_ENABLED,
  TOGGLE_LOCKED,
}

type AbstractFnReducerAction<T> = {
  type: FnReducerActionType;
  payload: T;
};

export interface FnReducerStringAction extends AbstractFnReducerAction<string> {
  type:
    | typeof FnReducerActionType.CHANGE_NAME
    | typeof FnReducerActionType.CHANGE_ROLE_KEY;
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
  | FnReducerTypeAction
  | FnReducerToggleAction;

export const FnEditingContext = createEditingContext<FnReducerAction>();
