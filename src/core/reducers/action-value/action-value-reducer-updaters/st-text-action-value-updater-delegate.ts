import { isSendTextAction } from '../../../../data/model/action/send-text/send-text';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { stTextGroup } from '../../../../ui/model/action/send-text/send-text-action-value-field-group';
import {
  changeActionValueValue,
  changeTextActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getStTextActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (groupIncludesField(stTextGroup, action) && isSendTextAction(state)) {
      return {
        ...state,
        text:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeTextActionValueType(state.text, action)
            : changeActionValueValue(state.text, action),
      };
    }
  };
