import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { UNSELECTED_ENUM } from '../../../common/consts';
import {
  BringAppAction,
  createBringAppAction,
} from '../../../../data/model/action/bring-app/bring-app';
import { NotImplementedError } from '../../../../error/not-implemented-error';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';
import {
  CallFunctionAction,
  createCallFunctionAction,
} from '../../../../data/model/action/call-function/call-function';

describe('call function action reducer: action.appTitle', () => {
  it('should handle change action.parameters[].actionValueType', () => {
    const obj: CallFunctionAction = {
      ...createCallFunctionAction(),
      parameters: [
        {
          id: '123',
          actionValueType: ActionValueType.Enum.USE_VARIABLE,
          variableType: VariableType.Enum.ENUM,
          variableId: 'asdf',
        },
      ],
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        type: ActionValueChangeIdentifierType.ID,
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<CallFunctionAction>({
      ...obj,
      parameters: [
        {
          id: '123',
          actionValueType: ActionValueType.Enum.ENTER_VALUE,
          enteredValueType: VariableType.Enum.ENUM,
          value: UNSELECTED_ENUM,
        },
      ],
    });
  });

  it('should handle change action.parameters[].value', () => {
    const obj: CallFunctionAction = {
      ...createCallFunctionAction(),
      parameters: [
        {
          id: '123',
          actionValueType: ActionValueType.Enum.ENTER_VALUE,
          enteredValueType: VariableType.Enum.ENUM,
          value: 'hi',
        },
      ],
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.ID,
        id: '123',
        value: 'zxcv',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<CallFunctionAction>({
      ...obj,
      parameters: [
        {
          id: '123',
          actionValueType: ActionValueType.Enum.ENTER_VALUE,
          enteredValueType: VariableType.Enum.ENUM,
          value: 'zxcv',
        },
      ],
    });
  });

  it('should handle change action.parameters[].variableId', () => {
    const obj: CallFunctionAction = {
      ...createCallFunctionAction(),
      parameters: [
        {
          id: '123',
          actionValueType: ActionValueType.Enum.USE_VARIABLE,
          variableType: VariableType.Enum.ENUM,
          variableId: '1234',
        },
      ],
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.ID,
        id: '123',
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<CallFunctionAction>({
      ...obj,
      parameters: [
        {
          id: '123',
          actionValueType: ActionValueType.Enum.USE_VARIABLE,
          variableType: VariableType.Enum.ENUM,
          variableId: 'asdf',
        },
      ],
    });
  });
});
