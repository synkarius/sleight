import { Action } from '../../../../data/model/action/action';
import { MissingDelegateError } from '../../../../error/missing-delegate-error';
import {
  ActionReducerActionValueChangePayloadAction,
  ActionReducerActionValueTypePayloadAction,
} from '../../../../ui/model/action/action-editing-context';
import { isDefined } from '../../../common/common-functions';
import { ActionValueUpdater } from './action-value-updater';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export class DelegatingActionValueUpdater implements ActionValueUpdater {
  constructor(private delegates: ActionValueUpdaterDelegate[]) {}
  update(
    state: Action,
    action:
      | ActionReducerActionValueChangePayloadAction
      | ActionReducerActionValueTypePayloadAction
  ): Action {
    const updated = this.delegates
      .map((delegate) => delegate(state, action))
      .find(isDefined);
    if (!updated) {
      throw new MissingDelegateError('ActionValueUpdaterDelegate');
    }
    return updated;
  }
}
