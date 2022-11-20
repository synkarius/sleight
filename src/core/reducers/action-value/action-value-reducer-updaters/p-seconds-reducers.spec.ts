import { actionReactReducer } from '../../action-reducers';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import { Field } from '../../../../validation/validation-field';
import {
  createPauseAction,
  PauseAction,
} from '../../../../data/model/action/pause/pause';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ActionValueChangeIdentifierType } from '../../../../ui/model/action/action-editing-context-support';

describe('pause action reducer: action.seconds', () => {
  it('should handle change action.seconds.actionValueType', () => {
    const obj: PauseAction = {
      ...createPauseAction(),
      seconds: {
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
        field: Field.AC_PAUSE_SECONDS_RADIO,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      seconds: {
        id: '123',
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
        enteredValueType: VariableType.Enum.NUMBER,
        value: 0,
      },
    });
  });

  it('should handle change action.seconds.value', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_PAUSE_SECONDS_VALUE,
        value: '34',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      seconds: {
        ...obj.seconds,
        value: 34,
      },
    });
  });

  it('should handle change action.seconds.variableId', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        type: ActionValueChangeIdentifierType.FIELD,
        field: Field.AC_PAUSE_SECONDS_VAR,
        value: 'asdf',
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      seconds: {
        ...obj.seconds,
        variableId: 'asdf',
      },
    });
  });
});
