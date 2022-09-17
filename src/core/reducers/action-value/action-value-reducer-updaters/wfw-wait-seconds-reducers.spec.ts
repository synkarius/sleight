import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { VariableType } from '../../../../data/model/variable/variable-types';
import {
  createWaitForWindowAction,
  WaitForWindowAction,
} from '../../../../data/model/action/wait-for-window/wait-for-window';

describe('wait for window action reducer: action.waitSeconds', () => {
  it('should handle change action.waitSeconds.actionValueType', () => {
    const obj: WaitForWindowAction = {
      ...createWaitForWindowAction(),
      waitSeconds: {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.NUMBER,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_WFW_WAIT_SECONDS_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      waitSeconds: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.NUMBER,
        value: 0,
      },
    });
  });

  it('should handle change action.waitSeconds.value', () => {
    const obj = createWaitForWindowAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_WFW_WAIT_SECONDS_VALUE,
        value: '23',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      waitSeconds: {
        ...obj.waitSeconds,
        value: 23,
      },
    });
  });

  it('should handle change action.waitSeconds.variableId', () => {
    const obj = createWaitForWindowAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_WFW_WAIT_SECONDS_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      waitSeconds: {
        ...obj.waitSeconds,
        variableId: 'asdf',
      },
    });
  });
});
