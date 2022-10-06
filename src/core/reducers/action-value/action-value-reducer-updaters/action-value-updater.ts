import { Action } from '../../../../data/model/action/action';
import {
  ActionReducerActionValueTypePayloadAction,
  ActionReducerChangePayloadAction,
} from '../../../../ui/model/action/action-editing-context';

export type ActionValueUpdater = {
  update: (
    state: Action,
    action:
      | ActionReducerChangePayloadAction
      | ActionReducerActionValueTypePayloadAction
  ) => Action;
};
