import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { copyIntoPythonFn, Fn } from '../../data/model/fn/fn';
import { FnType } from '../../data/model/fn/fn-types';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import {
  FnReducerAction,
  FnReducerActionType,
  FnReducerAddParamAction,
  FnReducerMoveParamAction,
  FnReducerNumberAction,
  FnReducerParamNameAction,
  FnReducerParamTypeAction,
  FnReducerStringAction,
  FnReducerTypeAction,
} from '../../ui/model/fn/fn-editing-context';
import { MoveDirection } from '../common/move-direction';

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

const changeImportPath = (state: Fn, action: FnReducerStringAction): Fn => {
  const fnType = state.type;
  switch (fnType) {
    case FnType.Enum.PYTHON:
      return { ...state, importTokens: action.payload.split('.') };
    default:
      throw new ExhaustivenessFailureError(fnType);
  }
};

const addParameter = (state: Fn, action: FnReducerAddParamAction): Fn => {
  const fnType = state.type;
  switch (fnType) {
    case FnType.Enum.PYTHON:
      return { ...state, parameters: [...state.parameters, action.payload] };
    default:
      throw new ExhaustivenessFailureError(fnType);
  }
};

const moveParameter = (state: Fn, action: FnReducerMoveParamAction): Fn => {
  const fnType = state.type;
  switch (fnType) {
    case FnType.Enum.PYTHON:
      const param = state.parameters[action.payload.index];
      if (param) {
        const newIndex =
          action.payload.direction === MoveDirection.UP
            ? action.payload.index - 1
            : action.payload.index + 1;
        if (newIndex >= 0 && newIndex < state.parameters.length) {
          const displaced = state.parameters[newIndex];
          const parametersCopy = [...state.parameters];
          parametersCopy[newIndex] = param;
          parametersCopy[action.payload.index] = displaced;
          return {
            ...state,
            parameters: parametersCopy,
          };
        }
      }
      return { ...state };
    default:
      throw new ExhaustivenessFailureError(fnType);
  }
};

const deleteParameter = (state: Fn, action: FnReducerNumberAction): Fn => {
  const fnType = state.type;
  switch (fnType) {
    case FnType.Enum.PYTHON:
      const parametersCopy = [...state.parameters];
      parametersCopy.splice(action.payload, 1);
      return {
        ...state,
        parameters: parametersCopy,
      };
    default:
      throw new ExhaustivenessFailureError(fnType);
  }
};

const changeParameterName = (
  state: Fn,
  action: FnReducerParamNameAction
): Fn => {
  const fnType = state.type;
  switch (fnType) {
    case FnType.Enum.PYTHON:
      return {
        ...state,
        parameters: state.parameters.map((param) => {
          if (param.id === action.payload.id) {
            return { ...param, name: action.payload.value };
          }
          return param;
        }),
      };
    default:
      throw new ExhaustivenessFailureError(fnType);
  }
};

const changeParameterType = (
  state: Fn,
  action: FnReducerParamTypeAction
): Fn => {
  const fnType = state.type;
  switch (fnType) {
    case FnType.Enum.PYTHON:
      return {
        ...state,
        parameters: state.parameters.map((param) => {
          if (param.id === action.payload.id) {
            return { ...param, type: action.payload.value };
          }
          return param;
        }),
      };
    default:
      throw new ExhaustivenessFailureError(fnType);
  }
};

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
    case FnReducerActionType.CHANGE_IMPORT_PATH:
      return changeImportPath(state, action);
    case FnReducerActionType.ADD_PARAMETER:
      return addParameter(state, action);
    case FnReducerActionType.MOVE_PARAMETER:
      return moveParameter(state, action);
    case FnReducerActionType.DELETE_PARAMETER:
      return deleteParameter(state, action);
    case FnReducerActionType.CHANGE_PARAMETER_NAME:
      return changeParameterName(state, action);
    case FnReducerActionType.CHANGE_PARAMETER_TYPE:
      return changeParameterType(state, action);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
