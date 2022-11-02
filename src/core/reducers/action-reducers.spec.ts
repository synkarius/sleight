import { createSendKeyPressAction } from '../../data/model/action/send-key/send-key';
import {
  ActionsState,
  saveAction,
  actionReduxReducer,
  actionReactReducer,
  deleteAction,
  setActions,
} from './action-reducers';
import {
  createPauseAction,
  PauseAction,
} from '../../data/model/action/pause/pause';
import { ActionType } from '../../data/model/action/action-types';
import { createNumberValue } from '../../data/model/action/action-value';
import { ActionReducerActionType } from '../../ui/model/action/action-editing-context';
import { Action } from '../../data/model/action/action';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

describe('action reducer', () => {
  const actionDefaultNamer = container.get(Tokens.DefaultNamer_Action);

  const initialState: ActionsState = {
    saved: {},
  };

  it('should handle initial state', () => {
    expect(actionReduxReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle save', () => {
    const obj = { ...createPauseAction(), name: '' };

    const preReducerState: ActionsState = {
      saved: {},
    };

    const expectedSaved: Record<string, Action> = {};
    expectedSaved[obj.id] = {
      ...obj,
      name: actionDefaultNamer.getName(obj),
    };
    const actual = actionReduxReducer(preReducerState, saveAction(obj));

    expect(actual.saved).toEqual(expectedSaved);
  });

  it('should handle save with name', () => {
    const obj = { ...createPauseAction(), name: 'asdf' };

    const preReducerState: ActionsState = {
      saved: {},
    };

    const expectedSaved: Record<string, Action> = {};
    expectedSaved[obj.id] = obj;
    const actual = actionReduxReducer(preReducerState, saveAction(obj));

    expect(actual.saved).toEqual(expectedSaved);
  });

  it('should handle delete', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: { [obj.id]: obj },
    };

    const actual = actionReduxReducer(preReducerState, deleteAction(obj.id));

    expect(actual.saved).toEqual(initialState.saved);
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

  it('should handle change name to blank', () => {
    const obj = { ...createPauseAction(), name: 'asdf' };

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_NAME,
      payload: '     ',
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      name: '',
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
      roleKey: 'asdf',
    });
  });

  it('should handle change type to pause', () => {
    const obj = createSendKeyPressAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.CHANGE_ACTION_TYPE,
      payload: ActionType.Enum.PAUSE,
    });

    const expectedAction: PauseAction = {
      id: obj.id,
      name: '',
      roleKey: '',
      type: ActionType.Enum.PAUSE,
      enabled: true,
      locked: false,
      centiseconds: { ...createNumberValue(), id: expect.any(String) },
    };

    expect(actual).not.toBe(obj);
    expect(actual).toEqual(expectedAction);
  });

  it('should handle toggle enabled', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.TOGGLE_ENABLED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      enabled: !obj.enabled,
    });
  });

  it('should handle toggle locked', () => {
    const obj = createPauseAction();

    const actual = actionReactReducer(obj, {
      type: ActionReducerActionType.TOGGLE_LOCKED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      locked: !obj.locked,
    });
  });

  it('should handle set', () => {
    const obj1 = createPauseAction();
    const preReducerState: ActionsState = {
      saved: { [obj1.id]: obj1 },
    };

    const obj2 = createPauseAction();
    const newReducerState: ActionsState = {
      saved: { [obj2.id]: obj2 },
    };

    const actual = actionReduxReducer(
      preReducerState,
      setActions(newReducerState.saved)
    );

    expect(actual).toEqual(newReducerState);
  });
});
