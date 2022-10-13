import { isWaitForWindowAction } from '../../../../data/model/action/wait-for-window/wait-for-window';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { wfwTitleGroup } from '../../../../ui/model/action/wait-for-window/wait-for-window-action-value-field-group';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getWfwTitleActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(wfwTitleGroup, action) &&
      isWaitForWindowAction(state)
    ) {
      return {
        ...state,
        title:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeEnumActionValueType(state.title, action)
            : changeActionValueValue(state.title, action),
      };
    }
  };
