import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import {
  ClickMouseAction,
  createMouseClickAction,
} from '../../../../data/model/action/mouse/mouse';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { UNSELECTED_ENUM } from '../../../common/consts';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';

describe('mouse action reducer: action.mouseButton', () => {
  it('should handle change action.mouseButton.actionValueType', () => {
    const obj: ClickMouseAction = {
      ...createMouseClickAction(),
      mouseButton: {
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
        field: Field.AC_MOUSE_MOUSE_BUTTON_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      mouseButton: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: UNSELECTED_ENUM,
      },
    });
  });

  it('should handle change action.mouseButton.value', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_MOUSE_MOUSE_BUTTON_VALUE,
        value: 'Left',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      mouseButton: {
        ...obj.mouseButton,
        value: 'Left',
      },
    });
  });

  it('should handle change action.mouseButton.variableId', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_MOUSE_MOUSE_BUTTON_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      mouseButton: {
        ...obj.mouseButton,
        variableId: 'asdf',
      },
    });
  });
});
