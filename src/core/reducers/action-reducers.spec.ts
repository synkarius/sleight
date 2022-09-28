import { createSendKeyPressAction } from '../../data/model/action/send-key/send-key';
import {
  ActionsState,
  selectAction,
  saveAction,
  actionReduxReducer,
  actionReactReducer,
  deleteAction,
} from './action-reducers';
import {
  createPauseAction,
  PauseAction,
} from '../../data/model/action/pause/pause';
import { ActionType } from '../../data/model/action/action-types';
import { createNumericValue } from '../../data/model/action/action-value';
import { ActionReducerActionType } from '../../ui/model/action/action-editing-context';
import { Action } from '../../data/model/action/action';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

describe('action reducer', () => {
  const actionDefaultNamer = container.get(Tokens.DefaultNamer_Action);

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
    const obj = { ...createPauseAction(), name: '' };

    const preReducerState: ActionsState = {
      saved: {},
      editingId: undefined,
    };

    const expectedSaved: Record<string, Action> = {};
    expectedSaved[obj.id] = {
      ...obj,
      name: actionDefaultNamer.getDefaultName(obj),
    };
    const actual = actionReduxReducer(preReducerState, saveAction(obj));

    expect(actual.saved).toEqual(expectedSaved);
  });

  it('should handle save with name', () => {
    const obj = { ...createPauseAction(), name: 'asdf' };

    const preReducerState: ActionsState = {
      saved: {},
      editingId: undefined,
    };

    const expectedSaved: Record<string, Action> = {};
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

  it('should handle delete', () => {
    const obj = createPauseAction();

    const preReducerState: ActionsState = {
      saved: { [obj.id]: obj },
      editingId: undefined,
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
      centiseconds: createNumericValue(),
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
});
