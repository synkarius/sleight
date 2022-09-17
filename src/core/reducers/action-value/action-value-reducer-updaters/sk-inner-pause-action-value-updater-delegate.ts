import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  isSendKeyAction,
  isSendKeyPressAction,
} from '../../../../data/model/action/send-key/send-key';
import { skInnerPauseGroup } from '../../../../ui/model/action/send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getSkInnerPauseActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(skInnerPauseGroup, action.payload.field) &&
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
