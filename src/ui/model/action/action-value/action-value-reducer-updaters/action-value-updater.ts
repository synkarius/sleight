import { Action } from '../../action';
import {
  ActionReducerActionValueTypePayloadAction,
  ActionReducerChangePayloadAction,
} from '../../action-editing-context';

export type ActionValueUpdater = (
  state: Action,
  action:
    | ActionReducerChangePayloadAction
    | ActionReducerActionValueTypePayloadAction
) => Action;
