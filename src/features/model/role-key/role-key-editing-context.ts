import { createEditingContext } from '../common/editing-context';

export enum RoleKeyActionType {
  CHANGE_VALUE,
}
export type RoleKeyReducerAction = {
  type: RoleKeyActionType;
  payload: string;
};
export const RoleKeyEditingContext =
  createEditingContext<RoleKeyReducerAction>();
