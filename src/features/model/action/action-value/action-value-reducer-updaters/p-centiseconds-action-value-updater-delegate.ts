import { ActionReducerActionType } from '../../action-editing-context';
import { isPauseAction } from '../../pause/pause';
import {
  changeActionValueValue,
  changeNumericActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getCentisecondsActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (isPauseAction(state)) {
      return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
        ? { ...state, centiseconds: changeNumericActionValueType(action) }
        : {
            ...state,
            centiseconds: changeActionValueValue(state.centiseconds, action),
          };
    }
  };
