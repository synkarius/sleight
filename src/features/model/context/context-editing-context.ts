import { createEditingContext } from '../common/editing-context';
import { ContextType } from './context-types';

export enum ContextReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_TYPE,
  CHANGE_MATCHER,
}
type AbstractContextReducerAction<T> = {
  type: ContextReducerActionType;
  payload: T;
};
export type ContextReducerStringAction = AbstractContextReducerAction<string>;
export type ContextReducerMatcherTypeAction =
  AbstractContextReducerAction<ContextType.Type>;
export type ContextReducerAction =
  | ContextReducerStringAction
  | ContextReducerMatcherTypeAction;
export const ContextEditingContext =
  createEditingContext<ContextReducerAction>();
