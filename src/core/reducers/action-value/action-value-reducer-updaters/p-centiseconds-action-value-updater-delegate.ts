import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { isPauseAction } from '../../../../data/model/action/pause/pause';
import {
  changeActionValueValue,
  changeNumberActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getPCentisecondsActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (isPauseAction(state)) {
      return {
        ...state,
        centiseconds:
          action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ? changeNumberActionValueType(state.centiseconds, action)
            : changeActionValueValue(state.centiseconds, action),
      };
    }
  };
