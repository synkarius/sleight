import { ActionReducerActionType } from '../../action-editing-context';
import {
  isSendKeyAction,
  isSendKeyHoldReleaseAction,
} from '../../send-key/send-key';
import { directionGroup } from '../../send-key/send-key-action-value-type-name-groups';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getDirectionActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      Object.values(directionGroup).includes(action.payload.field) &&
      isSendKeyAction(state) &&
      isSendKeyHoldReleaseAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, direction: changeEnumActionValueType(action) }
        : {
            ...state,
            direction: changeActionValueValue(state.direction, action),
          };
    }
  };
