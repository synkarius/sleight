import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { mMoveYGroup } from '../../../../ui/model/action/mouse/mouse-action-value-field-groups';
import {
  isMouseAction,
  isMoveMouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { MouseMovementType } from '../../../../data/model/action/mouse/mouse-movement-type';
import { limitNumericActionValueToPercentage } from './mm-move-reducer-support';

export const getMMouseMoveYActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(mMoveYGroup, action.payload.field) &&
      isMouseAction(state) &&
      isMoveMouseAction(state)
    ) {
      let newY =
        action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
          ? changeNumericActionValueType(action)
          : changeActionValueValue(state.y, action);
      if (state.mouseMovementType === MouseMovementType.Enum.WINDOW) {
        newY = limitNumericActionValueToPercentage(newY);
      }
      return { ...state, y: newY };
    }
  };
