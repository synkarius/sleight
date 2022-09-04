import { ActionReducerActionType } from '../../action-editing-context';
import { isSendKeyAction } from '../../send-key/send-key';
import { keyToSendGroup } from '../../send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getKeyToSendActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
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
