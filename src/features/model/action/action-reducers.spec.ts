import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { Action } from './action';
import { createSendKeyPressAction } from './send-key/send-key';
import {
  ActionsState,
  selectAction,
  saveAction,
  actionReduxReducer,
  actionReactReducer,
} from './action-reducers';
import { createPauseAction, PauseAction } from './pause/pause';
import { ActionType } from './action-types';
import { createNumericValue } from './action-value/action-value';
import { ActionReducerActionType } from './action-editing-context';

const createTestAction = (id: string): Action => {
  return {
    id: id,
    name: '',
    type: ActionType.Enum.BRING_APP,
    roleKeyId: undefined,
  };
};

describe('action reducer', () => {
  const initialState: ActionsState = {
    saved: {},
    editingId: undefined,
  };

  it('should handle initial state', () => {
    expect(actionReduxReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle save', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: {},
      editingId: undefined,
    };

    const expectedSaved: ReduxFriendlyStringMap<Action> = {};
    expectedSaved[obj.id] = obj;
    const actual = actionReduxReducer(preReducerState, saveAction(obj));

    expect(actual.saved).toEqual(expectedSaved);
  });

  it('should handle select', () => {
    const preReducerState: ActionsState = {
      saved: {},
      editingId: undefined,
    };

    const actual = actionReduxReducer(preReducerState, selectAction('asdf'));
    expect(actual.editingId).toEqual('asdf');
  });

  it('should handle clear', () => {
    const preReducerState: ActionsState = {
      saved: {},
      editingId: 'asdf',
    };

    const actual = actionReduxReducer(preReducerState, selectAction(undefined));

    expect(actual.editingId).toBeUndefined();
  });

  it('should handle change name', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_NAME,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ROLE_KEY,
      payload: 'asdf',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      roleKeyId: 'asdf',
    });
  });

  it('should handle change type to pause', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_TYPE,
      payload: ActionType.Enum.PAUSE,
    });

    const expectedAction: PauseAction = {
      ...createTestAction(obj.id),
      type: ActionType.Enum.PAUSE,
      centiseconds: createNumericValue(),
    };

    expect(actual).not.toBe(obj);
    expect(actual).toEqual(expectedAction);
  });
});
