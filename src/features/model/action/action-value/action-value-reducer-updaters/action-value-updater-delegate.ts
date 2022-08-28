import { Action } from '../../action';
import {
  ActionReducerActionValueTypePayloadAction,
  ActionReducerChangePayloadAction,
} from '../../action-editing-context';

export type ActionValueUpdaterDelegate = (
  state: Action,
  action:
    | ActionReducerChangePayloadAction
    | ActionReducerActionValueTypePayloadAction
) => Action | undefined;
