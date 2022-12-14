import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { isSendKeyAction } from '../../../../data/model/action/send-key/send-key';
import { skKeyToSendGroup } from '../../../../ui/model/action/send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getSkKeyToSendActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(skKeyToSendGroup, action) &&
      isSendKeyAction(state)
    ) {
      return {
        ...state,
        keyToSend:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeEnumActionValueType(state.keyToSend, action)
            : changeActionValueValue(state.keyToSend, action),
      };
    }
  };
