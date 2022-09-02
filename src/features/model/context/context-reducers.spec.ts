import { Context, createContext } from './context';
import {
  ContextsState,
  selectContext,
  contextReduxReducer,
  saveContext,
  contextReactReducer,
} from './context-reducers';
import { ContextType } from './context-types';
import { ContextReducerActionType } from './context-editing-context';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';

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
      roleKeyId: undefined,
      id: obj.id,
      name: contextDefaultNamer.getDefaultName(obj),
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
      roleKeyId: undefined,
      id: obj.id,
      name: 'asdf',
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
      roleKeyId: 'asdf',
    });
  });

  it('should handle change type', () => {
    const obj = createContext();
    const actual = contextReactReducer(obj, {
      type: ContextReducerActionType.CHANGE_TYPE,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      type: 'asdf',
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
});
