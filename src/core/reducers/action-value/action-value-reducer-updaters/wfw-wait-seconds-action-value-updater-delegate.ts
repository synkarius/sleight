import { isWaitForWindowAction } from '../../../../data/model/action/wait-for-window/wait-for-window';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { wfwWaitSecondsGroup } from '../../../../ui/model/action/wait-for-window/wait-for-window-action-value-field-group';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getWfwWaitSecondsActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(wfwWaitSecondsGroup, action) &&
      isWaitForWindowAction(state)
    ) {
      return {
        ...state,
        waitSeconds:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeNumericActionValueType(state.waitSeconds, action)
            : changeActionValueValue(state.waitSeconds, action),
      };
    }
  };
