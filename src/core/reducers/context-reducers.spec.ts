import { Context, createContext } from '../../data/model/context/context';
import {
  ContextsState,
  contextReduxReducer,
  saveContext,
  contextReactReducer,
  deleteContext,
  setContexts,
} from './context-reducers';
import { ContextType } from '../../data/model/context/context-types';
import { ContextReducerActionType } from '../../ui/model/context/context-editing-context';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

describe('context reducer', () => {
  const contextDefaultNamer = container.get(Tokens.DefaultNamer_Context);

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

  it('should handle delete', () => {
    const obj = createContext();

    const preReducerState: ContextsState = {
      saved: { [obj.id]: obj },
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

  it('should handle set', () => {
    const obj1 = createContext();
    const preReducerState: ContextsState = {
      saved: { [obj1.id]: obj1 },
    };

    const obj2 = createContext();
    const newReducerState: ContextsState = {
      saved: { [obj2.id]: obj2 },
    };

    const actual = contextReduxReducer(
      preReducerState,
      setContexts(newReducerState.saved)
    );

    expect(actual).toEqual(newReducerState);
  });
});
