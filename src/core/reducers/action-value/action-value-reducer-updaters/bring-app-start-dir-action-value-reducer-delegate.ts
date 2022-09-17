import { isBringAppAction } from '../../../../data/model/action/bring-app/bring-app';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { bringAppStarDirGroup } from '../../../../ui/model/action/bring-app/bring-app-action-value-field-group';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getBringAppStartDirActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(bringAppStarDirGroup, action.payload.field) &&
      isBringAppAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, startDir: changeEnumActionValueType(action) }
        : {
            ...state,
            startDir: changeActionValueValue(state.startDir, action),
          };
    }
  };
