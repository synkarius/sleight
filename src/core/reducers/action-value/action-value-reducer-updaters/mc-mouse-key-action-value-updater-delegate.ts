import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { mMouseKeyGroup } from '../../../../ui/model/action/mouse/mouse-action-value-field-groups';
import {
  isClickMouseAction,
  isMouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getMcMouseKeyActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(mMouseKeyGroup, action.payload.field) &&
      isMouseAction(state) &&
      isClickMouseAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, mouseButton: changeEnumActionValueType(action) }
        : {
            ...state,
            mouseButton: changeActionValueValue(state.mouseButton, action),
          };
    }
  };
