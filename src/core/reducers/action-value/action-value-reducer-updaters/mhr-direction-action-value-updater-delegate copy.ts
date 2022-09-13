import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { directionGroup } from '../../../../ui/model/action/mouse/click-mouse-action-value-field-groups';
import {
  isHoldReleaseMouseAction,
  isMouseAction,
} from '../../../../data/model/action/mouse/mouse';

export const getMhrDirectionActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      Object.values(directionGroup).includes(action.payload.field) &&
      isMouseAction(state) &&
      isHoldReleaseMouseAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, direction: changeEnumActionValueType(action) }
        : {
            ...state,
            direction: changeActionValueValue(state.direction, action),
          };
    }
  };
