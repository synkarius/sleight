import { Action } from '../../../../data/model/action/action';
import {
  ActionReducerActionValueTypePayloadAction,
  ActionReducerActionValueChangePayloadAction,
} from '../../../../ui/model/action/action-editing-context';

export type ActionValueUpdaterDelegate = (
  state: Action,
  action:
    | ActionReducerActionValueChangePayloadAction
    | ActionReducerActionValueTypePayloadAction
) => Action | undefined;
