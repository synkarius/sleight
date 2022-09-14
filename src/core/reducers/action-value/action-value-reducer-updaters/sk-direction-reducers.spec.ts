import { EnterValueType } from '../../../../data/model/action/action-value/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value/action-value-type';
import {
  createSendKeyHoldReleaseAction,
  SendKeyHoldReleaseAction,
} from '../../../../data/model/action/send-key/send-key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../../../common/consts';
import { actionReactReducer } from '../../action-reducers';

describe('action reducer: action.direction', () => {
  it('should handle change action.direction.actionValueType', () => {
    const obj: SendKeyHoldReleaseAction = {
      ...createSendKeyHoldReleaseAction(),
      direction: {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.CHOICE,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_SK_DIRECTION_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.ENUM,
        value: SELECT_DEFAULT_VALUE,
      },
    });
  });

  it('should handle change action.direction.value', () => {
    const obj = createSendKeyHoldReleaseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_SK_DIRECTION_VALUE,
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
        field: Field.AC_SK_DIRECTION_VAR,
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
});
