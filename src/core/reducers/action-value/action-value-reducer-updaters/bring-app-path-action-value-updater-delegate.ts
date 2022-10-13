import { isBringAppAction } from '../../../../data/model/action/bring-app/bring-app';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { bringAppPathGroup } from '../../../../ui/model/action/bring-app/bring-app-action-value-field-group';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getBringAppPathActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(bringAppPathGroup, action) &&
      isBringAppAction(state)
    ) {
      const appPath =
        action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
          ? changeEnumActionValueType(state.appPath, action)
          : changeActionValueValue(state.appPath, action);
      return { ...state, appPath };
    }
  };
