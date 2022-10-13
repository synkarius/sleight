import { ActionValueType } from '../../../../data/model/action/action-value-type';
import {
  createSendKeyHoldReleaseAction,
  SendKeyHoldReleaseAction,
} from '../../../../data/model/action/send-key/send-key';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';
import { Field } from '../../../../validation/validation-field';
import { UNSELECTED_ENUM } from '../../../common/consts';
import { actionReactReducer } from '../../action-reducers';

describe('sk action reducer: action.direction', () => {
  it('should handle change action.direction.actionValueType', () => {
    const obj: SendKeyHoldReleaseAction = {
      ...createSendKeyHoldReleaseAction(),
      direction: {
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
        field: Field.AC_SK_DIRECTION_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: UNSELECTED_ENUM,
      },
    });
  });

  it('should handle change action.direction.value', () => {
    const obj = createSendKeyHoldReleaseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
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
        type: ActionValueChangeIdentifierType.FIELD,
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
