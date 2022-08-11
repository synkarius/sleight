import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { RoleKey } from './role-key';
import {
  RoleKeyReducerActionType,
  RoleKeyReducerAction,
} from './role-key-editing-context';

export type RoleKeysState = {
  readonly saved: Record<string, RoleKey>;
  readonly editingId?: string;
};

const initialState: RoleKeysState = {
  saved: {},
  editingId: undefined,
};

const roleKeysSlice = createSlice({
  name: 'roleKeys',
  initialState,
  reducers: {
    selectRoleKey: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveRoleKey: (state, action: PayloadAction<RoleKey>) => {
      state.saved[action.payload.id] = action.payload;
    },
    deleteEditingRoleKey: (state, action: PayloadAction<string>) => {
      const roleKeyId = action.payload;
      delete state.saved[roleKeyId];
    },
  },
});

export const { selectRoleKey, saveRoleKey, deleteEditingRoleKey } =
  roleKeysSlice.actions;
export const roleKeyReduxReducer = roleKeysSlice.reducer;

export const roleKeyReactReducer = (
  state: RoleKey,
  action: RoleKeyReducerAction
): RoleKey => {
  switch (action.type) {
    case RoleKeyReducerActionType.CHANGE_VALUE:
      return { ...state, value: action.payload };
    default:
      throw new ExhaustivenessFailureError(action.type);
  }
};
