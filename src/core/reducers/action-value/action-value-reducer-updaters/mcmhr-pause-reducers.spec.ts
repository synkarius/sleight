import { ActionValueType } from '../../../../data/model/action/action-value-type';
import {
  ClickMouseAction,
  createMouseClickAction,
} from '../../../../data/model/action/mouse/mouse';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';
import { Field } from '../../../../validation/validation-field';
import { actionReactReducer } from '../../action-reducers';

describe('mouse action reducer: action.pause', () => {
  it('should handle change action.pause.actionValueType', () => {
    const obj: ClickMouseAction = {
      ...createMouseClickAction(),
      pause: {
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
        field: Field.AC_MOUSE_PAUSE_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      pause: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.NUMBER,
        value: 0,
      },
    });
  });

  it('should handle change action.pause.value', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_MOUSE_PAUSE_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      pause: {
        ...obj.pause,
        value: 34,
      },
    });
  });

  it('should handle change action.pause.variableId', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_MOUSE_PAUSE_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      pause: {
        ...obj.pause,
        variableId: 'asdf',
      },
    });
  });
});
