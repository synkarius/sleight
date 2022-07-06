import { Context, createContext } from './context';
import {
  Contexts,
  createNewEditingContext,
  selectContext,
  clearEditingContext,
  changeEditingContextName,
  changeEditingContextRoleKey,
  changeEditingContextType,
  changeEditingContextMatcher,
  saveEditingContext,
  contextReducer,
} from './context-reducers';
import { ContextType } from './context-types';
import { ReduxFriendlyStringMap } from '../../../util/structures';
global.crypto = require('crypto');

describe('context reducer', () => {
  const initialState: Contexts = {
    saved: {},
    editing: null,
  };
  it('should handle initial state', () => {
    expect(contextReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
    });
  });

  it('should handle create new', () => {
    const newContext = createContext();

    const actual = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle save', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );
    const actual = contextReducer(createdState, saveEditingContext());

    const expected: ReduxFriendlyStringMap<Context> = {};
    expected[newContext.id] = {
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );
    const savedState = contextReducer(createdState, saveEditingContext());

    const actual = contextReducer(savedState, selectContext(newContext.id));
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle clear', () => {
    const createdState = contextReducer(
      initialState,
      createNewEditingContext(createContext())
    );

    const actual = contextReducer(createdState, clearEditingContext());

    expect(actual.editing).toBeNull();
  });

  it('should handle change name', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextName('asdf')
    );
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: 'asdf',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle change role key', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextRoleKey('asdf')
    );
    expect(actual.editing).toEqual({
      roleKeyId: 'asdf',
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: '',
    });
  });

  it('should handle change type', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextType(ContextType.WINDOW_TITLE)
    );
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.WINDOW_TITLE,
      matcher: '',
    });
  });

  it('should handle change matcher', () => {
    const newContext = createContext();

    const createdState = contextReducer(
      initialState,
      createNewEditingContext(newContext)
    );

    const actual = contextReducer(
      createdState,
      changeEditingContextMatcher('asdf')
    );
    expect(actual.editing).toEqual({
      roleKeyId: null,
      id: newContext.id,
      name: '',
      type: ContextType.EXECUTABLE_NAME,
      matcher: 'asdf',
    });
  });
});
