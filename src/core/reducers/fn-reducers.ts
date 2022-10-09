import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { copyIntoPythonFn, Fn } from '../../data/model/fn/fn';
import { FnType } from '../../data/model/fn/fn-types';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import {
  FnReducerAction,
  FnReducerActionType,
  FnReducerStringAction,
  FnReducerTypeAction,
} from '../../ui/model/fn/fn-editing-context';

export type FnsState = {
  readonly saved: Record<string, Fn>;
};

const initialState: FnsState = {
  saved: {},
};

const fnsSlice = createSlice({
  name: 'fns',
  initialState,
  reducers: {
    saveFn: (state, action: PayloadAction<Fn>) => {
      state.saved[action.payload.id] = action.payload;
    },
    deleteFn: (state, action: PayloadAction<string>) => {
      delete state.saved[action.payload];
    },
    setFns: (state, action: PayloadAction<Record<string, Fn>>) => {
      state.saved = action.payload;
    },
  },
});

export const { saveFn, deleteFn, setFns } = fnsSlice.actions;
export const fnReduxReducer = fnsSlice.reducer;

const changeName = (state: Fn, action: FnReducerStringAction): Fn => {
  return { ...state, name: action.payload };
};

const changeRoleKey = (state: Fn, action: FnReducerStringAction): Fn => {
  return { ...state, roleKey: action.payload };
};

const changeType = (state: Fn, action: FnReducerTypeAction): Fn => {
  const fnType = action.payload;
  switch (fnType) {
    case FnType.Enum.PYTHON:
      return copyIntoPythonFn(state);
    default:
      throw new ExhaustivenessFailureError(fnType);
  }
};

const toggleEnabled = (state: Fn): Fn => ({
  ...state,
  enabled: !state.enabled,
});

const toggleLocked = (state: Fn): Fn => ({ ...state, locked: !state.locked });

export const fnReactReducer = (state: Fn, action: FnReducerAction): Fn => {
  const actionType = action.type;
  switch (actionType) {
    case FnReducerActionType.CHANGE_NAME:
      return changeName(state, action);
    case FnReducerActionType.CHANGE_ROLE_KEY:
      return changeRoleKey(state, action);
    case FnReducerActionType.CHANGE_TYPE:
      return changeType(state, action);
    case FnReducerActionType.TOGGLE_ENABLED:
      return toggleEnabled(state);
    case FnReducerActionType.TOGGLE_LOCKED:
      return toggleLocked(state);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
