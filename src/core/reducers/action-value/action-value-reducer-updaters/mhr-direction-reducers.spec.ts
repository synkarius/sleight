import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import {
  createMouseHoldAction,
  HoldReleaseMouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { UNSELECTED_ENUM } from '../../../common/consts';

describe('mouse action reducer: action.direction', () => {
  it('should handle change action.direction.actionValueType', () => {
    const obj: HoldReleaseMouseAction = {
      ...createMouseHoldAction(),
      direction: {
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.ENUM,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: Field.AC_MOUSE_DIRECTION_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: UNSELECTED_ENUM,
      },
    });
  });

  it('should handle change action.direction.value', () => {
    const obj = createMouseHoldAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: Field.AC_MOUSE_DIRECTION_VALUE,
        value: 'Up',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      direction: {
        ...obj.direction,
        value: 'Up',
      },
    });
  });

  it('should handle change action.direction.variableId', () => {
    const obj = createMouseHoldAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: Field.AC_MOUSE_DIRECTION_VAR,
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
