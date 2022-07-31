import {
  createSendKeyHoldReleaseAction,
  SendKeyHoldReleaseAction,
} from './send-key/send-key';
import { actionReactReducer } from './action-reducers';
import { ActionValueType } from './action-value/action-value-type';
import { ActionReducerActionType } from './action-editing-context';
import { Field } from '../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { EnterValueType } from './action-value/action-value';

describe('action reducer: action.direction', () => {
  it('should handle change action.direction.actionValueType', () => {
    const obj = createTestSendKeyAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_DIRECTION_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.TEXT,
        value: '',
      },
    });
  });

  it('should handle change action.direction.value', () => {
    const obj = createSendKeyHoldReleaseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_DIRECTION_VALUE,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.direction.variableId', () => {
    const obj = createSendKeyHoldReleaseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_DIRECTION_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.direction.roleKeyId', () => {
    const obj = createSendKeyHoldReleaseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID,
      payload: {
        field: Field.AC_DIRECTION_RK,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        roleKeyId: 'asdf',
      },
    });
  });
});

const createTestSendKeyAction = (): SendKeyHoldReleaseAction => {
  const obj = createSendKeyHoldReleaseAction();
  return {
    ...obj,
    direction: {
      ...obj.direction,
      actionValueType: ActionValueType.Enum.USE_ROLE_KEY,
      roleKeyId: SELECT_DEFAULT_VALUE,
    },
  };
};
