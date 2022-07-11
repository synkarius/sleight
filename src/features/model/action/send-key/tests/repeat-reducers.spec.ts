import { createSendKeyPressAction } from '../send-key';
import {
  ActionsState,
  actionReducer,
  validateRepeat,
  resetRepeat,
} from '../../action-reducers';
import { ActionValueType } from '../../action-value/action-value-type';
import { ActionValueOperation } from '../../action-value/action-value-operation';
import { SendKeyField } from '../send-key-payloads';
import { repeatVariable, repeatRoleKey } from '../../action-validation';
import {
  createSendKeyReduxAction,
  createTestSendKeyPressAction,
} from './test-utils';

describe('action reducer: action.repeat', () => {
  it('should handle change action.repeat.actionValueType', () => {
    const obj = createSendKeyPressAction();
    obj.repeat.actionValueType = ActionValueType.USE_ROLE_KEY;

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      createSendKeyReduxAction(
        ActionValueType.ENTER_VALUE,
        ActionValueOperation.CHANGE_TYPE,
        SendKeyField.REPEAT
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change action.repeat.value', () => {
    const obj = createSendKeyPressAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      createSendKeyReduxAction(
        '123',
        ActionValueOperation.CHANGE_ENTERED_VALUE,
        SendKeyField.REPEAT
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        value: 123,
      },
    });
  });

  it('should handle change action.repeat.variableId', () => {
    const obj = createSendKeyPressAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      createSendKeyReduxAction(
        'asdf',
        ActionValueOperation.CHANGE_VARIABLE_ID,
        SendKeyField.REPEAT
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.repeat.roleKeyId', () => {
    const obj = createSendKeyPressAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      createSendKeyReduxAction(
        'asdf',
        ActionValueOperation.CHANGE_ROLE_KEY_ID,
        SendKeyField.REPEAT
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        roleKeyId: 'asdf',
      },
    });
  });

  it('should handle action.repeat.variableId invalidation', () => {
    const obj = createSendKeyPressAction();
    obj.repeat.actionValueType = ActionValueType.USE_VARIABLE;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateRepeat());
    expect(actual.validationErrors).toEqual([repeatVariable.error]);
  });

  it('should handle action.repeat.variableId validation', () => {
    const obj = createSendKeyPressAction();
    obj.repeat.actionValueType = ActionValueType.USE_VARIABLE;
    obj.repeat.variableId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateRepeat());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle action.repeat.roleKeyId invalidation', () => {
    const obj = createSendKeyPressAction();
    obj.repeat.actionValueType = ActionValueType.USE_ROLE_KEY;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateRepeat());
    expect(actual.validationErrors).toEqual([repeatRoleKey.error]);
  });

  it('should handle action.repeat.roleKeyId validation', () => {
    const obj = createSendKeyPressAction();
    obj.repeat.actionValueType = ActionValueType.USE_ROLE_KEY;
    obj.repeat.roleKeyId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateRepeat());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle repeat reset', () => {
    const obj = createSendKeyPressAction();
    const expectedEditing = createTestSendKeyPressAction(obj.id);
    obj.repeat.value = 123;
    obj.repeat.variableId = 'asdf';
    obj.repeat.roleKeyId = 'asdf';
    /*
     * It shouldn't be possible for the actionValue to actually get into
     * this state where all 3 values are changed and both validation
     * errors are present. This test just demonstrates that all of that
     * data is cleared in a reset.
     */
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [repeatVariable.error, repeatRoleKey.error],
    };

    const actual = actionReducer(preReducerState, resetRepeat());

    const expected: ActionsState = {
      saved: {},
      editing: expectedEditing,
      validationErrors: [],
    };

    expect(actual).toEqual(expected);
  });
});
