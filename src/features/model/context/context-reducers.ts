import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnhandledContextEditingEventTypeError } from '../../../error/UnhandledContextEditingEventTypeError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { Context } from './context';
import {
  ContextReducerAction,
  ContextReducerActionType,
} from './context-editing-context';

export interface ContextsState {
  saved: ReduxFriendlyStringMap<Context>;
  editingId: string | undefined;
}

const initialState: ContextsState = {
  saved: {},
  editingId: undefined,
};

const contextsSlice = createSlice({
  name: 'contexts',
  initialState,
  reducers: {
    selectContext: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveEditingContext: (state, action: PayloadAction<Context>) => {
      state.saved[action.payload.id] = action.payload;
    },
  },
});

export const { selectContext, saveEditingContext } = contextsSlice.actions;
export const contextReduxReducer = contextsSlice.reducer;

const changeEditingContextName = (
  state: Context,
  action: ContextReducerAction
): Context => {
  return {
    ...state,
    name: action.payload,
  };
};
const changeEditingContextRoleKey = (
  state: Context,
  action: ContextReducerAction
): Context => {
  return {
    ...state,
    roleKeyId: action.payload,
  };
};
const changeEditingContextType = (
  state: Context,
  action: ContextReducerAction
): Context => {
  return {
    ...state,
    type: action.payload,
  };
};
const changeEditingContextMatcher = (
  state: Context,
  action: ContextReducerAction
): Context => {
  return {
    ...state,
    matcher: action.payload,
  };
};

export const contextReactReducer = (
  state: Context,
  action: ContextReducerAction
): Context => {
  switch (action.type) {
    case ContextReducerActionType.CHANGE_NAME:
      return changeEditingContextName(state, action);
    case ContextReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingContextRoleKey(state, action);
    case ContextReducerActionType.CHANGE_TYPE:
      return changeEditingContextType(state, action);
    case ContextReducerActionType.CHANGE_MATCHER:
      return changeEditingContextMatcher(state, action);
    default:
      throw new UnhandledContextEditingEventTypeError(action.type);
  }
};
