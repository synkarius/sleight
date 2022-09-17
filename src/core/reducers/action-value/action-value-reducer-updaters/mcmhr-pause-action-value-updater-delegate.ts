import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { mPauseGroup } from '../../../../ui/model/action/mouse/mouse-action-value-field-groups';
import {
  isClickMouseAction,
  isHoldReleaseMouseAction,
  isMouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

/**
 * For mouse click or mouse hold/release actions.
 */
export const getMcMhrPauseActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(mPauseGroup, action.payload.field) &&
      ((isMouseAction(state) && isClickMouseAction(state)) ||
        (isMouseAction(state) && isHoldReleaseMouseAction(state)))
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, pause: changeNumericActionValueType(action) }
        : {
            ...state,
            pause: changeActionValueValue(state.pause, action),
          };
    }
  };
