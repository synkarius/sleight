import { MissingDelegateError } from '../../../../../error/missing-delegate-error';
import { isDefined } from '../../../../../util/common-functions';
import { ActionValueUpdater } from './action-value-updater';
import { getActionValueUpdaterDelegates } from './action-value-updater-delegates';

export const getActionValueUpdater: () => ActionValueUpdater = () => {
  const delegates = getActionValueUpdaterDelegates();
  return (state, action) => {
    const updated = delegates
      .map((delegate) => delegate(state, action))
      .find(isDefined);
    if (!updated) {
      throw new MissingDelegateError('ActionValueUpdaterDelegate');
    }
    return updated;
  };
};
