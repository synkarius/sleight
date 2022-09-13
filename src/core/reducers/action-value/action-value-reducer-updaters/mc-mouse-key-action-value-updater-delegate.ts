import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { mouseKeyGroup } from '../../../../ui/model/action/mouse/click-mouse-action-value-field-groups';
import {
  isClickMouseAction,
  isMouseAction,
} from '../../../../data/model/action/mouse/mouse';

export const getMcMouseKeyActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      Object.values(mouseKeyGroup).includes(action.payload.field) &&
      isMouseAction(state) &&
      isClickMouseAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, mouseKey: changeEnumActionValueType(action) }
        : {
            ...state,
            mouseKey: changeActionValueValue(state.mouseKey, action),
          };
    }
  };
