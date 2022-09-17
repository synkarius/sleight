import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { isSendKeyAction } from '../../../../data/model/action/send-key/send-key';
import { skOuterPauseGroup } from '../../../../ui/model/action/send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getSkOuterPauseActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(skOuterPauseGroup, action.payload.field) &&
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
