import {
  createSendKeyPressAction,
  SendKeyPressAction,
} from './send-key/send-key';
import { actionReactReducer } from './action-reducers';
import { ActionValueType } from './action-value/action-value-type';
import { ActionReducerActionType } from './action-editing-context';
import { Field } from './../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { EnterValueType } from './action-value/action-value';

describe('action reducer: action.outerPause', () => {
  it('should handle change action.outerPause.actionValueType', () => {
    const obj = createTestSendKeyAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_OUTER_PAUSE_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      outerPause: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.NUMERIC,
        value: 0,
      },
    });
  });

  it('should handle change action.outerPause.value', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_OUTER_PAUSE_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      outerPause: {
        ...obj.outerPause,
        value: 34,
      },
    });
  });

  it('should handle change action.outerPause.variableId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_OUTER_PAUSE_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      outerPause: {
        ...obj.outerPause,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.outerPause.roleKeyId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID,
      payload: {
        field: Field.AC_OUTER_PAUSE_RK,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      outerPause: {
        ...obj.outerPause,
        roleKeyId: 'asdf',
      },
    });
  });
});

const createTestSendKeyAction = (): SendKeyPressAction => {
  const obj = createSendKeyPressAction();
  return {
    ...obj,
    outerPause: {
      ...obj.outerPause,
      actionValueType: ActionValueType.Enum.USE_ROLE_KEY,
      roleKeyId: SELECT_DEFAULT_VALUE,
    },
  };
};
