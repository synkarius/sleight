import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeNumberActionValueType,
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
      groupIncludesField(mRepeatGroup, action) &&
      isMouseAction(state) &&
      isClickMouseAction(state)
    ) {
      return {
        ...state,
        repeat:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeNumberActionValueType(state.repeat, action)
            : changeActionValueValue(state.repeat, action),
      };
    }
  };
