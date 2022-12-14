import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { VariableType } from '../../../../data/model/variable/variable-types';
import {
  createMouseMoveAction,
  MouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';

describe('mouse move action reducer: action.y', () => {
  it('should handle change action.y.actionValueType', () => {
    const obj: MouseAction = {
      ...createMouseMoveAction(),
      y: {
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
        field: Field.AC_MOUSE_Y_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      y: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.NUMBER,
        value: 0,
      },
    });
  });

  it('should handle change action.y.value', () => {
    const obj = createMouseMoveAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_MOUSE_Y_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      y: {
        ...obj.y,
        value: 34,
      },
    });
  });

  it('should handle change action.y.variableId', () => {
    const obj = createMouseMoveAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_MOUSE_Y_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      y: {
        ...obj.y,
        variableId: 'asdf',
      },
    });
  });
});
