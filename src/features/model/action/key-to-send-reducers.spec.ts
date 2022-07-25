import { createSendKeyPressAction } from './send-key/send-key';
import { actionReactReducer } from './action-reducers';
import { ActionValueType } from './action-value/action-value-type';
import { ActionReducerActionType } from './action-editing-context';
import { Field } from './../../../validation/validation-field';

describe('action reducer: action.keyToSend', () => {
  it('should handle change action.keyToSend.actionValueType', () => {
    const obj = createSendKeyPressAction();
    obj.keyToSend.actionValueType = ActionValueType.Enum.USE_ROLE_KEY;

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_KEY_TO_SEND_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        ...obj.keyToSend,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });
  });

  it('should handle change action.keyToSend.value', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_KEY_TO_SEND_VALUE,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        ...obj.keyToSend,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.keyToSend.variableId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_KEY_TO_SEND_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        ...obj.keyToSend,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.keyToSend.roleKeyId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID,
      payload: {
        field: Field.AC_KEY_TO_SEND_RK,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        ...obj.keyToSend,
        roleKeyId: 'asdf',
      },
    });
  });
});
