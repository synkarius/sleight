import { createSendKeyHoldReleaseAction } from '../send-key';
import {
  ActionsState,
  actionReducer,
  validateDirection,
  resetDirection,
} from '../../action-reducers';
import { ActionValueType } from '../../action-value/action-value-type';
import { ActionValueOperation } from '../../action-value/action-value-operation';
import { SendKeyField } from '../send-key-payloads';
import { directionValidators } from '../../action-validation';
import {
  createSendKeyReduxAction,
  createTestSendKeyHoldReleaseAction,
} from './test-utils';

describe('action reducer: action.direction', () => {
  it('should handle change action.direction.actionValueType', () => {
    const obj = createSendKeyHoldReleaseAction();
    obj.direction.actionValueType = ActionValueType.USE_ROLE_KEY;

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
        SendKeyField.DIRECTION
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        actionValueType: ActionValueType.ENTER_VALUE,
      },
    });
  });

  it('should handle change action.direction.value', () => {
    const obj = createSendKeyHoldReleaseAction();

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
        SendKeyField.DIRECTION
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.direction.variableId', () => {
    const obj = createSendKeyHoldReleaseAction();

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
        SendKeyField.DIRECTION
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        variableId: 'asdf',
      },
    });
  });

  it('should handle change action.direction.roleKeyId', () => {
    const obj = createSendKeyHoldReleaseAction();

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
        SendKeyField.DIRECTION
      )
    );
    expect(actual.editing).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        roleKeyId: 'asdf',
      },
    });
  });

  it('should handle change action.direction.value invalidation', () => {
    // empty string
    const obj1 = createSendKeyHoldReleaseAction();

    const preReducerState1: ActionsState = {
      saved: {},
      editing: obj1,
      validationErrors: [],
    };

    const actual1 = actionReducer(preReducerState1, validateDirection());
    expect(actual1.validationErrors).toEqual([directionValidators.value.error]);

    // blank string
    const obj2 = createSendKeyHoldReleaseAction();

    const preReducerState2: ActionsState = {
      saved: {},
      editing: obj2,
      validationErrors: [],
    };

    const actual2 = actionReducer(preReducerState2, validateDirection());
    expect(actual2.validationErrors).toEqual([directionValidators.value.error]);
  });

  it('should handle change action.direction.value validation', () => {
    const obj = createSendKeyHoldReleaseAction();
    obj.direction.value = 'a';

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateDirection());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle change action.direction.variableId invalidation', () => {
    const obj = createSendKeyHoldReleaseAction();
    obj.direction.actionValueType = ActionValueType.USE_VARIABLE;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateDirection());
    expect(actual.validationErrors).toEqual([
      directionValidators.variable.error,
    ]);
  });

  it('should handle change action.direction.variableId validation', () => {
    const obj = createSendKeyHoldReleaseAction();
    obj.direction.actionValueType = ActionValueType.USE_VARIABLE;
    obj.direction.variableId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateDirection());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle change action.direction.roleKeyId invalidation', () => {
    const obj = createSendKeyHoldReleaseAction();
    obj.direction.actionValueType = ActionValueType.USE_ROLE_KEY;
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateDirection());
    expect(actual.validationErrors).toEqual([
      directionValidators.roleKey.error,
    ]);
  });

  it('should handle change action.direction.roleKeyId validation', () => {
    const obj = createSendKeyHoldReleaseAction();
    obj.direction.actionValueType = ActionValueType.USE_ROLE_KEY;
    obj.direction.roleKeyId = 'a';
    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, validateDirection());
    expect(actual.validationErrors).toEqual([]);
  });

  it('should handle change direction reset', () => {
    const newObject = createSendKeyHoldReleaseAction();
    const expectedEditing = createTestSendKeyHoldReleaseAction(newObject.id);
    newObject.direction.value = 'asdf';
    newObject.direction.variableId = 'asdf';
    newObject.direction.roleKeyId = 'asdf';
    /*
     * It shouldn't be possible for the actionValue to actually get into
     * this state where all 3 values are filled and all 3 validation
     * errors are present. This test just demonstrates that all of that
     * data is cleared in a reset.
     */
    const preReducerState: ActionsState = {
      saved: {},
      editing: newObject,
      validationErrors: Object.values(directionValidators).map((v) => v.error),
    };

    const actual = actionReducer(preReducerState, resetDirection());

    const expected: ActionsState = {
      saved: {},
      editing: expectedEditing,
      validationErrors: [],
    };

    expect(actual).toEqual(expected);
  });
});
