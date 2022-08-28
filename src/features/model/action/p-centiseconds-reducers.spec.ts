import { actionReactReducer } from './action-reducers';
import { ActionValueType } from './action-value/action-value-type';
import { ActionReducerActionType } from './action-editing-context';
import { Field } from '../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { EnterValueType } from './action-value/action-value';
import { createPauseAction, PauseAction } from './pause/pause';

describe('action reducer: action.centiseconds', () => {
  it('should handle change action.centiseconds.actionValueType', () => {
    const obj = createTestPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_CENTISECONDS_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      centiseconds: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.NUMERIC,
        value: 0,
      },
    });
  });

  it('should handle change action.centiseconds.value', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_CENTISECONDS_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      centiseconds: {
        ...obj.centiseconds,
        value: 34,
      },
    });
  });

  it('should handle change action.centiseconds.variableId', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_CENTISECONDS_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      centiseconds: {
        ...obj.centiseconds,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.centiseconds.roleKeyId', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID,
      payload: {
        field: Field.AC_CENTISECONDS_RK,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      centiseconds: {
        ...obj.centiseconds,
        roleKeyId: 'asdf',
      },
    });
  });
});

const createTestPauseAction = (): PauseAction => {
  const obj = createPauseAction();
  return {
    ...obj,
    centiseconds: {
      ...obj.centiseconds,
      actionValueType: ActionValueType.Enum.USE_ROLE_KEY,
      roleKeyId: SELECT_DEFAULT_VALUE,
    },
  };
};
