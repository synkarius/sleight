import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import {
  ActionReducerActionType,
  ActionValueChangeIdentifierType,
} from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { UNSELECTED_ENUM } from '../../../common/consts';
import {
  BringAppAction,
  createBringAppAction,
} from '../../../../data/model/action/bring-app/bring-app';

describe('bring app action reducer: action.startDir', () => {
  it('should handle change action.startDir.actionValueType', () => {
    const obj: BringAppAction = {
      ...createBringAppAction(),
      startDir: {
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
        field: Field.AC_BRING_START_DIR_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      startDir: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: UNSELECTED_ENUM,
      },
    });
  });

  it('should handle change action.startDir.value', () => {
    const obj = createBringAppAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_BRING_START_DIR_VALUE,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      startDir: {
        ...obj.startDir,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.startDir.variableId', () => {
    const obj = createBringAppAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_BRING_START_DIR_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      startDir: {
        ...obj.startDir,
        variableId: 'asdf',
      },
    });
  });
});
