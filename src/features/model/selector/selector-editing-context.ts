import { createEditingContext } from '../../../common/editing-context';

export enum SelectorReducerActionType {
  CHANGE_ITEM,
}
export type SelectorReducerAction = {
  type: SelectorReducerActionType;
  payload: string;
};
export const SelectorEditingContext =
  createEditingContext<SelectorReducerAction>();
