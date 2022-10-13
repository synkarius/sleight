import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { mDirectionGroup } from '../../../../ui/model/action/mouse/mouse-action-value-field-groups';
import {
  isHoldReleaseMouseAction,
  isMouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getMhrDirectionActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(mDirectionGroup, action) &&
      isMouseAction(state) &&
      isHoldReleaseMouseAction(state)
    ) {
      return {
        ...state,
        direction:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeEnumActionValueType(state.direction, action)
            : changeActionValueValue(state.direction, action),
      };
    }
  };
