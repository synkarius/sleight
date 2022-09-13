import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  isSendKeyAction,
  isSendKeyPressAction,
} from '../../../../data/model/action/send-key/send-key';
import { repeatGroup } from '../../../../ui/model/action/send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getSkRepeatActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      Object.values(repeatGroup).includes(action.payload.field) &&
      isSendKeyAction(state) &&
      isSendKeyPressAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, repeat: changeNumericActionValueType(action) }
        : {
            ...state,
            repeat: changeActionValueValue(state.repeat, action),
          };
    }
  };