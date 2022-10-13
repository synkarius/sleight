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
    if (groupIncludesField(mimicWordsGroup, action) && isMimicAction(state)) {
      return {
        ...state,
        words:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeTextActionValueType(state.words, action)
            : changeActionValueValue(state.words, action),
      };
    }
  };
