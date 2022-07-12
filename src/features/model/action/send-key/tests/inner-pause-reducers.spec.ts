import { createSendKeyPressAction } from '../send-key';
import {
  ActionsState,
  actionReducer,
  validateInnerPause,
  resetInnerPause,
} from '../../action-reducers';
import { ActionValueType } from '../../action-value/action-value-type';
import { ActionValueOperation } from '../../action-value/action-value-operation';
import { SendKeyField } from '../send-key-payloads';
import { innerPauseValidators } from '../../action-validation';
import {
  createSendKeyReduxAction,
  createTestSendKeyPressAction,
} from './test-utils';

describe('action reducer: action.innerPause', () => {
  it('should handle change action.innerPause.actionValueType', () => {
    const obj = createSendKeyPressAction();
    obj.innerPause.actionValueType = ActionValueType.USE_ROLE_KEY;

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
        SendKeyField.INNER_PAUSE
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      innerPause: {
        ...obj.innerPause,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change action.innerPause.value', () => {
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
        SendKeyField.INNER_PAUSE
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      innerPause: {
        ...obj.innerPause,
        value: 123,
      },
    });
  });

  it('should handle change action.innerPause.variableId', () => {
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
        SendKeyField.INNER_PAUSE
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      innerPause: {
        ...obj.innerPause,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.innerPause.roleKeyId', () => {
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
        SendKeyField.INNER_PAUSE
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      innerPause: {
        ...obj.innerPause,
        roleKeyId: 'asdf',
      },
    });
  });

  it('should handle action.innerPause.variableId invalidation', () => {
    const obj = createSendKeyPressAction();
    obj.innerPause.actionValueType = ActionValueType.USE_VARIABLE;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateInnerPause());
    expect(actual.validationErrors).toEqual([
      innerPauseValidators.variable.error,
    ]);
  });

  it('should handle action.innerPause.variableId validation', () => {
    const obj = createSendKeyPressAction();
    obj.innerPause.actionValueType = ActionValueType.USE_VARIABLE;
    obj.innerPause.variableId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateInnerPause());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle action.innerPause.roleKeyId invalidation', () => {
    const obj = createSendKeyPressAction();
    obj.innerPause.actionValueType = ActionValueType.USE_ROLE_KEY;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateInnerPause());
    expect(actual.validationErrors).toEqual([
      innerPauseValidators.roleKey.error,
    ]);
  });

  it('should handle action.innerPause.roleKeyId validation', () => {
    const obj = createSendKeyPressAction();
    obj.innerPause.actionValueType = ActionValueType.USE_ROLE_KEY;
    obj.innerPause.roleKeyId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateInnerPause());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle innerPause reset', () => {
    const obj = createSendKeyPressAction();
    const expectedEditing = createTestSendKeyPressAction(obj.id);
    obj.innerPause.value = 123;
    obj.innerPause.variableId = 'asdf';
    obj.innerPause.roleKeyId = 'asdf';
    /*
     * It shouldn't be possible for the actionValue to actually get into
     * this state where all 3 values are changed and both validation
     * errors are present. This test just demonstrates that all of that
     * data is cleared in a reset.
     */
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: Object.values(innerPauseValidators).map((v) => v.error),
    };

    const actual = actionReducer(preReducerState, resetInnerPause());

    const expected: ActionsState = {
      saved: {},
      editing: expectedEditing,
      validationErrors: [],
    };

    expect(actual).toEqual(expected);
  });
});
