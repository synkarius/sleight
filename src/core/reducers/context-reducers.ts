import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { Context } from '../../data/model/context/context';
import {
  ContextReducerAction,
  ContextReducerActionType,
  ContextReducerMatcherTypeAction,
  ContextReducerStringAction,
} from '../../ui/model/context/context-editing-context';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

export interface ContextsState {
  readonly saved: Record<string, Context>;
}

const initialState: ContextsState = {
  saved: {},
};

const addDefaults = (context: Context): Context => {
  const contextDefaultNamer = container.get(Tokens.DefaultNamer_Context);
  return {
    ...context,
    name: context.name.trim() || contextDefaultNamer.getDefaultName(context),
  };
};

const contextsSlice = createSlice({
  name: 'contexts',
  initialState,
  reducers: {
    saveContext: (state, action: PayloadAction<Context>) => {
      state.saved[action.payload.id] = addDefaults(action.payload);
    },
    deleteContext: (state, action: PayloadAction<string>) => {
      delete state.saved[action.payload];
    },
  },
});

export const { saveContext, deleteContext } = contextsSlice.actions;
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
    roleKey: action.payload,
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
const toggleEditingContextEnabled = (state: Context): Context => ({
  ...state,
  enabled: !state.enabled,
});

const toggleEditingContextLocked = (state: Context): Context => ({
  ...state,
  locked: !state.locked,
});

export const contextReactReducer = (
  state: Context,
  action: ContextReducerAction
): Context => {
  const actionType = action.type;
  switch (actionType) {
    case ContextReducerActionType.CHANGE_NAME:
      return changeEditingContextName(state, action);
    case ContextReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingContextRoleKey(state, action);
    case ContextReducerActionType.CHANGE_TYPE:
      return changeEditingContextType(state, action);
    case ContextReducerActionType.CHANGE_MATCHER:
      return changeEditingContextMatcher(state, action);
    case ContextReducerActionType.TOGGLE_ENABLED:
      return toggleEditingContextEnabled(state);
    case ContextReducerActionType.TOGGLE_LOCKED:
      return toggleEditingContextLocked(state);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
