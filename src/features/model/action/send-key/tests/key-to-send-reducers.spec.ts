import { createSendKeyPressAction } from '../send-key';
import {
  ActionsState,
  actionReducer,
  validateKeyToSend,
  resetKeyToSend,
} from '../../action-reducers';
import { ActionValueType } from '../../action-value/action-value-type';
import { ActionValueOperation } from '../../action-value/action-value-operation';
import { SendKeyField } from '../send-key-payloads';
import {
  keyToSendVariable,
  keyToSendRoleKey,
  keyToSendNotEmpty,
} from '../../action-validation';
import {
  createSendKeyReduxAction,
  createTestSendKeyPressAction,
} from './test-utils';

describe('action reducer: action.sendKey', () => {
  it('should handle change action.sendKey.actionValueType', () => {
    const obj = createSendKeyPressAction();
    obj.sendKey.actionValueType = ActionValueType.USE_ROLE_KEY;

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
        SendKeyField.KEY_TO_SEND
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      sendKey: {
        ...obj.sendKey,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change action.sendKey.value', () => {
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
        ActionValueOperation.CHANGE_ENTERED_VALUE,
        SendKeyField.KEY_TO_SEND
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      sendKey: {
        ...obj.sendKey,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.sendKey.variableId', () => {
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
        SendKeyField.KEY_TO_SEND
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      sendKey: {
        ...obj.sendKey,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.sendKey.roleKeyId', () => {
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
        SendKeyField.KEY_TO_SEND
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      sendKey: {
        ...obj.sendKey,
        roleKeyId: 'asdf',
      },
    });
  });

  it('should handle change action.sendKey.value invalidation', () => {
    // empty string
    const obj1 = createSendKeyPressAction();

    const preReducerState1: ActionsState = {
      saved: {},
      editing: obj1,
      validationErrors: [],
    };

    const actual1 = actionReducer(preReducerState1, validateKeyToSend());
    expect(actual1.validationErrors).toEqual([keyToSendNotEmpty.error]);

    // blank string
    const obj2 = createSendKeyPressAction();

    const preReducerState2: ActionsState = {
      saved: {},
      editing: obj2,
      validationErrors: [],
    };

    const actual2 = actionReducer(preReducerState2, validateKeyToSend());
    expect(actual2.validationErrors).toEqual([keyToSendNotEmpty.error]);
  });

  it('should handle change action.sendKey.value validation', () => {
    const obj = createSendKeyPressAction();
    obj.sendKey.value = 'a';

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateKeyToSend());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle change action.sendKey.variableId invalidation', () => {
    const obj = createSendKeyPressAction();
    obj.sendKey.actionValueType = ActionValueType.USE_VARIABLE;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateKeyToSend());
    expect(actual.validationErrors).toEqual([keyToSendVariable.error]);
  });

  it('should handle change action.sendKey.variableId validation', () => {
    const obj = createSendKeyPressAction();
    obj.sendKey.actionValueType = ActionValueType.USE_VARIABLE;
    obj.sendKey.variableId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateKeyToSend());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle change action.sendKey.roleKeyId invalidation', () => {
    const obj = createSendKeyPressAction();
    obj.sendKey.actionValueType = ActionValueType.USE_ROLE_KEY;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateKeyToSend());
    expect(actual.validationErrors).toEqual([keyToSendRoleKey.error]);
  });

  it('should handle change action.sendKey.roleKeyId validation', () => {
    const obj = createSendKeyPressAction();
    obj.sendKey.actionValueType = ActionValueType.USE_ROLE_KEY;
    obj.sendKey.roleKeyId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateKeyToSend());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle change sendKey reset', () => {
    const newObject = createSendKeyPressAction();
    const expectedEditing = createTestSendKeyPressAction(newObject.id);
    newObject.sendKey.value = 'asdf';
    newObject.sendKey.variableId = 'asdf';
    newObject.sendKey.roleKeyId = 'asdf';
    /*
     * It shouldn't be possible for the actionValue to actually get into
     * this state where all 3 values are filled and all 3 validation
     * errors are present. This test just demonstrates that all of that
     * data is cleared in a reset.
     */
    const preReducerState: ActionsState = {
      saved: {},
      editing: newObject,
      validationErrors: [
        keyToSendNotEmpty.error,
        keyToSendVariable.error,
        keyToSendRoleKey.error,
      ],
    };

    const actual = actionReducer(preReducerState, resetKeyToSend());

    const expected: ActionsState = {
      saved: {},
      editing: expectedEditing,
      validationErrors: [],
    };

    expect(actual).toEqual(expected);
  });
});
