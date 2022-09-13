import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { isSendKeyAction } from '../../../../data/model/action/send-key/send-key';
import { keyToSendGroup } from '../../../../ui/model/action/send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getSkKeyToSendActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      Object.values(keyToSendGroup).includes(action.payload.field) &&
      isSendKeyAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, keyToSend: changeEnumActionValueType(action) }
        : {
            ...state,
            keyToSend: changeActionValueValue(state.keyToSend, action),
          };
    }
  };
