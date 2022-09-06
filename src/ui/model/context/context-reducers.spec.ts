import { Context, createContext } from './context';
import {
  ContextsState,
  selectContext,
  contextReduxReducer,
  saveContext,
  contextReactReducer,
  deleteContext,
} from './context-reducers';
import { ContextType } from './context-types';
import { ContextReducerActionType } from './context-editing-context';
import { getDefaultInjectionContext } from '../../../di/app-default-injection-context';

const injected = getDefaultInjectionContext();
const contextDefaultNamer = injected.default.namers.context;

describe('context reducer', () => {
  it('should handle initial state', () => {
    expect(contextReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: undefined,
    });
  });

  it('should handle save', () => {
    const obj = { ...createContext(), name: '' };

    const prereducerState: ContextsState = {
      saved: {},
      editingId: undefined,
    };

    const actual = contextReduxReducer(prereducerState, saveContext(obj));

    const expected: Record<string, Context> = {};
    expected[obj.id] = {
      roleKey: '',
      id: obj.id,
      name: contextDefaultNamer.getDefaultName(obj),
      enabled: true,
      locked: false,
      type: ContextType.Enum.EXECUTABLE_NAME,
      matcher: '',
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle save with name', () => {
    const obj = { ...createContext(), name: 'asdf' };

    const prereducerState: ContextsState = {
      saved: {},
      editingId: undefined,
    };

    const actual = contextReduxReducer(prereducerState, saveContext(obj));

    const expected: Record<string, Context> = {};
    expected[obj.id] = {
      roleKey: '',
      id: obj.id,
      name: 'asdf',
      enabled: true,
      locked: false,
      type: ContextType.Enum.EXECUTABLE_NAME,
      matcher: '',
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const prereducerState: ContextsState = {
      saved: {},
      editingId: undefined,
    };
    const actual = contextReduxReducer(prereducerState, selectContext('asdf'));

    expect(actual).toEqual({
      saved: {},
      editingId: 'asdf',
    });
  });

  it('should handle clear', () => {
    const prereducerState: ContextsState = {
      saved: {},
      editingId: 'asdf',
    };
    const actual = contextReduxReducer(prereducerState, selectContext());

    expect(actual).toEqual({ saved: {}, editingId: undefined });
  });

  it('should handle delete', () => {
    const obj = createContext();

    const preReducerState: ContextsState = {
      saved: { [obj.id]: obj },
      editingId: undefined,
    };

    const actual = contextReduxReducer(preReducerState, deleteContext(obj.id));

    expect(actual.saved).toEqual({});
  });

  it('should handle change name', () => {
    const obj = createContext();
    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.CHANGE_NAME,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      name: 'asdf',
    });
  });

  it('should handle change name to blank', () => {
    const obj = { ...createContext(), name: 'asdf' };
    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.CHANGE_NAME,
      payload: '      ',
    });

    expect(actual).toEqual({
      ...obj,
      name: '',
    });
  });

  it('should handle change role key', () => {
    const obj = createContext();
    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.CHANGE_ROLE_KEY,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      roleKey: 'asdf',
    });
  });

  it('should handle change type', () => {
    const obj: Context = {
      ...createContext(),
      type: ContextType.Enum.EXECUTABLE_NAME,
    };
    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.CHANGE_TYPE,
      payload: ContextType.Enum.WINDOW_TITLE,
    });

    expect(actual).toEqual({
      ...obj,
      type: ContextType.Enum.WINDOW_TITLE,
    });
  });

  it('should handle change matcher', () => {
    const obj = createContext();
    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.CHANGE_MATCHER,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      matcher: 'asdf',
    });
  });

  it('should handle toggle enabled', () => {
    const obj = createContext();

    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.TOGGLE_ENABLED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      enabled: !obj.enabled,
    });
  });

  it('should handle toggle locked', () => {
    const obj = createContext();

    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.TOGGLE_LOCKED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      locked: !obj.locked,
    });
  });
});
