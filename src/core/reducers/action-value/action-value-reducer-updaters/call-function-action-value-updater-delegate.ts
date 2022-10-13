import {
  isEnumActionValue,
  isNumberActionValue,
  isTextActionValue,
} from '../../../../data/model/action/action-value';
import { isCallFunctionAction } from '../../../../data/model/action/call-function/call-function';
import { MissingGuardError } from '../../../../error/missing-guard-error';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { isIdIdentifiedActionValuePayload } from '../../../../ui/model/action/action-editing-context-support';
import {
  changeActionValueValue,
  changeEnumActionValueType,
  changeNumberActionValueType,
  changeTextActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getCallFunctionActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    if (
      isCallFunctionAction(state) &&
      isIdIdentifiedActionValuePayload(action.payload)
    ) {
      const actionValueId = action.payload.id;
      return {
        ...state,
        parameters: state.parameters.map((param) => {
          if (param.id === actionValueId) {
            if (
              action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
            ) {
              if (isTextActionValue(param)) {
                return changeTextActionValueType(param, action);
              } else if (isNumberActionValue(param)) {
                return changeNumberActionValueType(param, action);
              } else if (isEnumActionValue(param)) {
                return changeEnumActionValueType(param, action);
              } else {
                throw new MissingGuardError('CallFunctionActionValueUpdater');
              }
            } else {
              return changeActionValueValue(param, action);
            }
          }
          return param;
        }),
      };
    }
  };
