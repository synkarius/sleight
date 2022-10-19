import { createTextValue } from '../../data/model/action/action-value';
import {
  CallFunctionAction,
  createCallFunctionAction,
} from '../../data/model/action/call-function/call-function';
import { ActionReducerActionType } from '../../ui/model/action/action-editing-context';
import { actionReactReducer } from './action-reducers';

describe('action reducer for call function actions', () => {
  it('should handle select fn', () => {
    const obj = createCallFunctionAction();
    const parameter1 = createTextValue();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_FN,
      payload: {
        functionId: 'fnId-1',
        defaultActionValues: [parameter1],
      },
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual<CallFunctionAction>({
      ...obj,
      functionId: 'fnId-1',
      parameters: [parameter1],
    });
  });
});
