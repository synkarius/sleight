import { isBringAppAction } from '../../../../data/model/action/bring-app/bring-app';
import { isCallFunctionAction } from '../../../../data/model/action/call-function/call-function';
import { NotImplementedError } from '../../../../error/not-implemented-error';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { groupIncludesField } from '../../../../ui/model/action/action-value-type-name-group';
import { bringAppTitleGroup } from '../../../../ui/model/action/bring-app/bring-app-action-value-field-group';
import { Field } from '../../../../validation/validation-field';
import {
  changeActionValueValue,
  changeEnumActionValueType,
} from './action-value-reducer-support';
import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';

export const getCallFunctionActionValueUpdaterDelegate: () => ActionValueUpdaterDelegate =
  () => (state, action) => {
    const callFunctionFields = [
      Field.AC_CALL_FUNC_PARAMETER_RADIO,
      Field.AC_CALL_FUNC_PARAMETER_VALUE,
      Field.AC_CALL_FUNC_PARAMETER_VAR,
    ];
    if (
      // callFunctionFields.includes(action.payload.field) &&
      isCallFunctionAction(state)
    ) {
      throw new NotImplementedError(
        'getCallFunctionActionValueUpdaterDelegate'
      );
      // return action.type === ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE
      //   ? { ...state, appTitle: changeEnumActionValueType(something, action) }
      //   : {
      //       ...state,
      //       appTitle: changeActionValueValue(state.appTitle, action),
      //     };
    }
    return undefined;
  };
