import { ActionValueType } from '../../../../data/model/action/action-value-type';
import {
  createSendKeyPressAction,
  SendKeyAction,
} from '../../../../data/model/action/send-key/send-key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import {
  ActionReducerActionType,
  ActionValueChangeIdentifierType,
} from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { UNSELECTED_ENUM } from '../../../common/consts';
import { actionReactReducer } from '../../action-reducers';

describe('sk action reducer: action.keyToSend', () => {
  it('should handle change action.keyToSend.actionValueType', () => {
    const obj: SendKeyAction = {
      ...createSendKeyPressAction(),
      keyToSend: {
        id: '123',
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.ENUM,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_SK_KEY_TO_SEND_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      keyToSend: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: UNSELECTED_ENUM,
      },
    });
  });

  it('should handle change action.keyToSend.value', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_SK_KEY_TO_SEND_VALUE,
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
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_SK_KEY_TO_SEND_VAR,
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
