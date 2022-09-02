import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';
import { Context } from './context';
import {
  ContextReducerAction,
  ContextReducerActionType,
  ContextReducerMatcherTypeAction,
  ContextReducerStringAction,
} from './context-editing-context';

export interface ContextsState {
  readonly saved: Record<string, Context>;
  readonly editingId?: string;
}

const initialState: ContextsState = {
  saved: {},
  editingId: undefined,
};

const injected = getDefaultInjectionContext();
const contextDefaultNamer = injected.default.namers.context;

const addDefaults = (context: Context): Context => {
  return {
    ...context,
    name: context.name.trim() || contextDefaultNamer.getDefaultName(context),
  };
};

const contextsSlice = createSlice({
  name: 'contexts',
  initialState,
  reducers: {
    selectContext: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveContext: (state, action: PayloadAction<Context>) => {
      state.saved[action.payload.id] = addDefaults(action.payload);
    },
    deleteContext: (state, action: PayloadAction<string>) => {
      delete state.saved[action.payload];
    },
  },
});

export const { selectContext, saveContext, deleteContext } =
  contextsSlice.actions;
export const contextReduxReducer = contextsSlice.reducer;

const changeEditingContextName = (
  state: Context,
  action: ContextReducerStringAction
): Context => {
  return {
    ...state,
    name: action.payload.trim() === '' ? '' : action.payload,
  };
};
const changeEditingContextRoleKey = (
  state: Context,
  action: ContextReducerStringAction
): Context => {
  return {
    ...state,
    roleKeyId: action.payload,
  };
};
const changeEditingContextType = (
  state: Context,
  action: ContextReducerMatcherTypeAction
): Context => {
  return {
    ...state,
    type: action.payload,
  };
};
const changeEditingContextMatcher = (
  state: Context,
  action: ContextReducerStringAction
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
      return changeEditingContextType(
        state,
        action as ContextReducerMatcherTypeAction
      );
    case ContextReducerActionType.CHANGE_MATCHER:
      return changeEditingContextMatcher(state, action);
    default:
      throw new ExhaustivenessFailureError(action.type);
  }
};
