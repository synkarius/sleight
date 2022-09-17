import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  isSendKeyAction,
  isSendKeyHoldReleaseAction,
} from '../../../../data/model/action/send-key/send-key';
import { skDirectionGroup } from '../../../../ui/model/action/send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getSkDirectionActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(skDirectionGroup, action.payload.field) &&
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
