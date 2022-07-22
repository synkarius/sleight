import { createEditingContext } from '../common/editing-context';

export enum RoleKeyReducerActionType {
  CHANGE_VALUE,
}
export type RoleKeyReducerAction = {
  type: RoleKeyReducerActionType;
  payload: string;
};
export const RoleKeyEditingContext =
  createEditingContext<RoleKeyReducerAction>();
