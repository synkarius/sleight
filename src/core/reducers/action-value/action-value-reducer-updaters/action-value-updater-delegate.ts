import { Action } from '../../../../data/model/action/action';
import {
  ActionReducerActionValueTypePayloadAction,
  ActionReducerChangePayloadAction,
} from '../../../../ui/model/action/action-editing-context';

export type ActionValueUpdaterDelegate = (
  state: Action,
  action:
    | ActionReducerChangePayloadAction
    | ActionReducerActionValueTypePayloadAction
) => Action | undefined;