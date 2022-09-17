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
      groupIncludesField(wfwExecutableGroup, action.payload.field) &&
      isWaitForWindowAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, executable: changeEnumActionValueType(action) }
        : {
            ...state,
            executable: changeActionValueValue(state.executable, action),
          };
    }
  };
