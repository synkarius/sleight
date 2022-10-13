import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeNumberActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { mMoveXGroup } from '../../../../ui/model/action/mouse/mouse-action-value-field-groups';
import {
  isMouseAction,
  isMoveMouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { MouseMovementType } from '../../../../data/model/action/mouse/mouse-movement-type';
import { limitNumericActionValueToPercentage } from './mm-move-reducer-support';

/** Should limit x to 0-100% range. Outside this range doesn't make sense for
 * window percentage.
 */
export const getMMouseMoveXActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(mMoveXGroup, action) &&
      isMouseAction(state) &&
      isMoveMouseAction(state)
    ) {
      let newX =
        action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
          ? changeNumberActionValueType(state.x, action)
          : changeActionValueValue(state.x, action);
      if (
        state.mouseMovementType === MouseMovementType.Enum.WINDOW_PERCENTAGE
      ) {
        newX = limitNumericActionValueToPercentage(newX);
      }
      return { ...state, x: newX };
    }
  };
