import { ActionReducerActionType } from '../../action-editing-context';
import { isSendKeyAction, isSendKeyPressAction } from '../../send-key/send-key';
import { innerPauseGroup } from '../../send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getInnerPauseActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      Object.values(innerPauseGroup).includes(action.payload.field) &&
      isSendKeyAction(state) &&
      isSendKeyPressAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, innerPause: changeNumericActionValueType(action) }
        : {
            ...state,
            innerPause: changeActionValueValue(state.innerPause, action),
          };
    }
  };
