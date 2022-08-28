import { ActionReducerActionType } from '../../action-editing-context';
import { isSendKeyAction } from '../../send-key/send-key';
import { outerPauseGroup } from '../../send-key/send-key-action-value-type-name-groups';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getOuterPauseActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      Object.values(outerPauseGroup).includes(action.payload.field) &&
      isSendKeyAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, outerPause: changeNumericActionValueType(action) }
        : {
            ...state,
            outerPause: changeActionValueValue(state.outerPause, action),
          };
    }
  };
