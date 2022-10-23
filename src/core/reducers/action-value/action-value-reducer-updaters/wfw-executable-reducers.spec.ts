import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { VariableType } from '../../../../data/model/variable/variable-types';
import {
  createWaitForWindowAction,
  WaitForWindowAction,
} from '../../../../data/model/action/wait-for-window/wait-for-window';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';

describe('wait for window action reducer: action.executable', () => {
  it('should handle change action.executable.actionValueType', () => {
    const obj: WaitForWindowAction = {
      ...createWaitForWindowAction(),
      executable: {
        id: '123',
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.ENUM,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_WFW_EXECUTABLE_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        newDefaultValue: '',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      executable: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: '',
      },
    });
  });

  it('should handle change action.executable.value', () => {
    const obj = createWaitForWindowAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_WFW_EXECUTABLE_VALUE,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      executable: {
        ...obj.executable,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.executable.variableId', () => {
    const obj = createWaitForWindowAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_WFW_EXECUTABLE_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      executable: {
        ...obj.executable,
        variableId: 'asdf',
      },
    });
  });
});
