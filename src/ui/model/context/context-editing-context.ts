import { createEditingContext } from '../../../core/common/editing-context';
import { ContextType } from '../../../data/model/context/context-types';

export enum ContextReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_TYPE,
  CHANGE_MATCHER,
  TOGGLE_ENABLED,
  TOGGLE_LOCKED,
}
type AbstractContextReducerAction<T> = {
  type: ContextReducerActionType;
  payload: T;
};
export interface ContextReducerStringAction
  extends AbstractContextReducerAction<string> {
  type:
    | typeof ContextReducerActionType.CHANGE_NAME
    | typeof ContextReducerActionType.CHANGE_ROLE_KEY
    | typeof ContextReducerActionType.CHANGE_MATCHER;
}
export interface ContextReducerMatcherTypeAction
  extends AbstractContextReducerAction<ContextType.Type> {
  type: typeof ContextReducerActionType.CHANGE_TYPE;
}
interface ContextReducerToggleAction
  extends Omit<AbstractContextReducerAction<unknown>, 'payload'> {
  type:
    | typeof ContextReducerActionType.TOGGLE_ENABLED
    | typeof ContextReducerActionType.TOGGLE_LOCKED;
}
export type ContextReducerAction =
  | ContextReducerStringAction
  | ContextReducerMatcherTypeAction
  | ContextReducerToggleAction;

export const ContextEditingContext =
  createEditingContext<ContextReducerAction>();
