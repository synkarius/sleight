import { EnterValueType } from '../../../../data/model/action/action-value/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value/action-value-type';
import {
  createSendKeyPressAction,
  SendKeyPressAction,
} from '../../../../data/model/action/send-key/send-key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { actionReactReducer } from '../../action-reducers';

describe('action reducer: action.innerPause', () => {
  it('should handle change action.innerPause.actionValueType', () => {
    const obj: SendKeyPressAction = {
      ...createSendKeyPressAction(),
      innerPause: {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.RANGE,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_INNER_PAUSE_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      innerPause: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.NUMERIC,
        value: 0,
      },
    });
  });

  it('should handle change action.innerPause.value', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_INNER_PAUSE_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      innerPause: {
        ...obj.innerPause,
        value: 34,
      },
    });
  });

  it('should handle change action.innerPause.variableId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_INNER_PAUSE_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      innerPause: {
        ...obj.innerPause,
        variableId: 'asdf',
      },
    });
  });
});
