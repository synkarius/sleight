import { isWaitForWindowAction } from '../../../../data/model/action/wait-for-window/wait-for-window';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { wfwExecutableGroup } from '../../../../ui/model/action/wait-for-window/wait-for-window-action-value-field-group';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getWfwExecutableActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(wfwExecutableGroup, action) &&
      isWaitForWindowAction(state)
    ) {
      return {
        ...state,
        executable:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeEnumActionValueType(state.executable, action)
            : changeActionValueValue(state.executable, action),
      };
    }
  };
