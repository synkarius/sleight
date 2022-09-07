import { EnterValueType } from '../../../../data/model/action/action-value/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value/action-value-type';
import {
  createSendKeyPressAction,
  SendKeyAction,
} from '../../../../data/model/action/send-key/send-key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../../../common/consts';
import { actionReactReducer } from '../../action-reducers';

describe('action reducer: action.keyToSend', () => {
  it('should handle change action.keyToSend.actionValueType', () => {
    const obj: SendKeyAction = {
      ...createSendKeyPressAction(),
      keyToSend: {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.CHOICE,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_KEY_TO_SEND_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.ENUM,
        value: SELECT_DEFAULT_VALUE,
      },
    });
  });

  it('should handle change action.keyToSend.value', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_KEY_TO_SEND_VALUE,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        ...obj.keyToSend,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.keyToSend.variableId', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_KEY_TO_SEND_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        ...obj.keyToSend,
        variableId: 'asdf',
      },
    });
  });
});
