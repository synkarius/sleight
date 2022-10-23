import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { VariableType } from '../../../../data/model/variable/variable-types';
import {
  BringAppAction,
  createBringAppAction,
} from '../../../../data/model/action/bring-app/bring-app';
import {
  ActionValueChangeIdentifierType,
  createAVCTypeChangePayload,
} from '../../../../ui/model/action/action-editing-context-support';
import { bringAppPathGroup } from '../../../../ui/model/action/bring-app/bring-app-action-value-field-group';

describe('bring app action reducer: action.appPath', () => {
  it('should handle change action.appPath.actionValueType', () => {
    const obj: BringAppAction = {
      ...createBringAppAction(),
      appPath: {
        id: '123',
        actionValueType: ActionValueType.Enum.USE_VARIABLE,
        variableType: VariableType.Enum.ENUM,
        variableId: 'asdf',
      },
    };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: createAVCTypeChangePayload(
        ActionValueType.Enum.ENTER_VALUE,
        bringAppPathGroup
      ),
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      appPath: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.ENUM,
        value: '',
      },
    });
  });

  it('should handle change action.appPath.value', () => {
    const obj = createBringAppAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_BRING_PATH_VALUE,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      appPath: {
        ...obj.appPath,
        value: 'asdf',
      },
    });
  });

  it('should handle change action.appPath.variableId', () => {
    const obj = createBringAppAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_BRING_PATH_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      appPath: {
        ...obj.appPath,
        variableId: 'asdf',
      },
    });
  });
});
