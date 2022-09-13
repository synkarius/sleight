import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { EnterValueType } from '../../../../data/model/action/action-value/action-value';
import {
  ClickMouseAction,
  createMouseClickAction,
} from '../../../../data/model/action/mouse/mouse';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { SELECT_DEFAULT_VALUE } from '../../../common/consts';

describe('mouse action reducer: action.mouseKey', () => {
  it('should handle change action.mouseKey.actionValueType', () => {
    const obj: ClickMouseAction = {
      ...createMouseClickAction(),
      mouseKey: {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.CHOICE,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_MOUSE_MOUSE_BUTTON_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      mouseKey: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: EnterValueType.ENUM,
        value: SELECT_DEFAULT_VALUE,
      },
    });
  });

  it('should handle change action.mouseKey.value', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_MOUSE_MOUSE_BUTTON_VALUE,
        value: 'Left',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      mouseKey: {
        ...obj.mouseKey,
        value: 'Left',
      },
    });
  });

  it('should handle change action.mouseKey.variableId', () => {
    const obj = createMouseClickAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_MOUSE_MOUSE_BUTTON_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      mouseKey: {
        ...obj.mouseKey,
        variableId: 'asdf',
      },
    });
  });
});
