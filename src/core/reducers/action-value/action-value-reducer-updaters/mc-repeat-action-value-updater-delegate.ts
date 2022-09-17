import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { mRepeatGroup } from '../../../../ui/model/action/mouse/mouse-action-value-field-groups';
import {
  isClickMouseAction,
  isMouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getMcRepeatActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(mRepeatGroup, action.payload.field) &&
      isMouseAction(state) &&
      isClickMouseAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, repeat: changeNumericActionValueType(action) }
        : {
            ...state,
            repeat: changeActionValueValue(state.repeat, action),
          };
    }
  };
