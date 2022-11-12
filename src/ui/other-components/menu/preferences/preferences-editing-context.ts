import { createSimpleEditingContext } from '../../../../core/common/editing-context';

export enum PreferencesReducerActionType {
  CHANGE_NEGATIVIZER,
}

type AbstractPreferencesReducerAction<T> = {
  type: PreferencesReducerActionType;
  payload: T;
};

export interface PreferencesReducerStringAction
  extends AbstractPreferencesReducerAction<string> {
  type: typeof PreferencesReducerActionType.CHANGE_NEGATIVIZER;
}

export type PreferencesReducerAction = PreferencesReducerStringAction;

export const PreferencesEditingContext =
  createSimpleEditingContext<PreferencesReducerAction>();
