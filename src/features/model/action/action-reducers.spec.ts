import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { Action } from './action';
import { createSendKeyPressAction } from './send-key/send-key';
import {
  ActionsState,
  createNewEditingAction,
  selectAction,
  clearEditingAction,
  changeEditingActionName,
  changeEditingActionRoleKey,
  changeEditingActionType,
  saveAndClearEditingAction,
  actionReducer,
} from './action-reducers';
import { createPauseAction, PauseAction } from './pause/pause';
import { ActionType } from './action-types';
import { createRangeValue } from './action-value/action-value';

const createTestAction = (id: string): Action => {
  return {
    id: id,
    name: '',
    type: '',
    roleKeyId: null,
  };
};

describe('action reducer', () => {
  const initialState: ActionsState = {
    saved: {},
    editing: null,
    validationErrors: [],
  };

  it('should handle initial state', () => {
    expect(actionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle create new editing action', () => {
    const newObject = createPauseAction();

    const actual = actionReducer(
      initialState,
      createNewEditingAction(newObject)
    );

    expect(actual.editing).toEqual(newObject);
  });

  it('should handle save', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const expectedSaved: ReduxFriendlyStringMap<Action> = {};
    expectedSaved[obj.id] = obj;
    const actual = actionReducer(preReducerState, saveAndClearEditingAction());

    expect(actual.editing).toBeNull();
    expect(actual.saved).toEqual(expectedSaved);
  });

  it('should handle select', () => {
    const obj = createPauseAction();
    const savedMap: ReduxFriendlyStringMap<Action> = {};
    savedMap[obj.id] = obj;
    const preReducerState: ActionsState = {
      saved: savedMap,
      editing: null,
      validationErrors: [],
    };

    const expectedAction = {
      ...createTestAction(obj.id),
      type: ActionType.PAUSE,
      centiseconds: createRangeValue(),
    };

    const actual = actionReducer(preReducerState, selectAction(obj.id));
    expect(actual.editing).toEqual(expectedAction);
  });

  it('should handle clear', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(preReducerState, clearEditingAction());

    expect(actual.editing).toBeNull();
  });

  it('should handle change name', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      changeEditingActionName('asdf')
    );
    expect(actual.editing).toEqual({
      ...obj,
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const actual = actionReducer(
      preReducerState,
      changeEditingActionRoleKey('asdf')
    );
    expect(actual.editing).toEqual({
      ...obj,
      roleKeyId: 'asdf',
    });
  });

  it('should handle change type to pause', () => {
    const obj = createSendKeyPressAction();

    const preReducerState: ActionsState = {
      saved: {},
      editing: obj,
      validationErrors: [],
    };

    const expectedAction: PauseAction = {
      ...createTestAction(obj.id),
      type: ActionType.PAUSE,
      centiseconds: createRangeValue(),
    };
    const actual = actionReducer(
      preReducerState,
      changeEditingActionType({ actionType: ActionType.PAUSE })
    );

    expect(actual.editing).toEqual(expectedAction);
  });
});
