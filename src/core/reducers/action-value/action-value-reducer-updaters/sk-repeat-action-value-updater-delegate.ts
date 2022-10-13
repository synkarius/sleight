import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  isSendKeyAction,
  isSendKeyPressAction,
} from '../../../../data/model/action/send-key/send-key';
import { skRepeatGroup } from '../../../../ui/model/action/send-key/send-key-action-value-field-groups';
import {
  changeActionValueValue,
  changeNumberActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';

export const getSkRepeatActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(skRepeatGroup, action) &&
      isSendKeyAction(state) &&
      isSendKeyPressAction(state)
    ) {
      return {
        ...state,
        repeat:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeNumberActionValueType(state.repeat, action)
            : changeActionValueValue(state.repeat, action),
      };
    }
  };
