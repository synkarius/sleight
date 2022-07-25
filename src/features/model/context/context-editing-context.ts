import { createEditingContext } from '../common/editing-context';

export enum ContextReducerActionType {
  CHANGE_NAME,
  CHANGE_ROLE_KEY,
  CHANGE_TYPE,
  CHANGE_MATCHER,
}
export type ContextReducerAction = {
  type: ContextReducerActionType;
  payload: string;
};
export const ContextEditingContext =
  createEditingContext<ContextReducerAction>();
