import { ActionValueType } from '../../../../data/model/action/action-value-type';
import {
  createSendKeyPressAction,
  SendKeyPressAction,
} from '../../../../data/model/action/send-key/send-key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';
import { Field } from '../../../../validation/validation-field';
import { actionReactReducer } from '../../action-reducers';

describe('sk action reducer: action.outerPause', () => {
  it('should handle change action.outerPause.actionValueType', () => {
    const obj: SendKeyPressAction = {
      ...createSendKeyPressAction(),
      outerPause: {
        id: '123',
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.NUMBER,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_SK_OUTER_PAUSE_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      outerPause: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.NUMBER,
        value: 0,
      },
    });
  });

  it('should handle change action.outerPause.value', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_SK_OUTER_PAUSE_VALUE,
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
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_SK_OUTER_PAUSE_VAR,
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
});
