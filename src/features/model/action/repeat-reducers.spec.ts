import { createSendKeyPressAction } from './send-key/send-key';
import { actionReactReducer } from './action-reducers';
import { ActionValueType } from './action-value/action-value-type';
import { ActionReducerActionType } from './action-editing-context';
import { Field } from './../../../validation/validation-field';

describe('action reducer: action.repeat', () => {
  it('should handle change action.repeat.actionValueType', () => {
    const obj = createSendKeyPressAction();
    obj.repeat.actionValueType = ActionValueType.Enum.USE_ROLE_KEY;

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_REPEAT_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });
  });

  it('should handle change action.repeat.value', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_REPEAT_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        value: 34,
      },
    });
  });

  it('should handle change action.repeat.variableId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_REPEAT_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.repeat.roleKeyId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID,
      payload: {
        field: Field.AC_REPEAT_RK,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        roleKeyId: 'asdf',
      },
    });
  });
});
