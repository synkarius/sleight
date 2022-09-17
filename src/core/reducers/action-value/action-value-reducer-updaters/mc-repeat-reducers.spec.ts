import { ActionValueType } from '../../../../data/model/action/action-value-type';
import {
  ClickMouseAction,
  createMouseClickAction,
} from '../../../../data/model/action/mouse/mouse';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { actionReactReducer } from '../../action-reducers';

describe('mouse action reducer: action.repeat', () => {
  it('should handle change action.repeat.actionValueType', () => {
    const obj: ClickMouseAction = {
      ...createMouseClickAction(),
      repeat: {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.NUMBER,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_MOUSE_REPEAT_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      repeat: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.NUMBER,
        value: 0,
      },
    });
  });

  it('should handle change action.repeat.value', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_MOUSE_REPEAT_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        value: 34,
      },
    });
  });

  it('should handle change action.repeat.variableId', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_MOUSE_REPEAT_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      repeat: {
        ...obj.repeat,
        variableId: 'asdf',
      },
    });
  });
});
