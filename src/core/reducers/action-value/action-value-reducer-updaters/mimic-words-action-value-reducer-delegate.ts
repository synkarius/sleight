import { isMimicAction } from '../../../../data/model/action/mimic/mimic';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { mimicWordsGroup } from '../../../../ui/model/action/mimic/mimic-action-value-field-group';
import {
  changeActionValueValue,
  changeTextActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getMimicWordsActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      groupIncludesField(mimicWordsGroup, action.payload.field) &&
      isMimicAction(state)
    ) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, words: changeTextActionValueType(action) }
        : {
            ...state,
            words: changeActionValueValue(state.words, action),
          };
    }
  };
