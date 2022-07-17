import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnhandledRoleKeyEditingEventTypeError } from '../../../error/UnhandledRoleKeyEditingEventTypeError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { RoleKey } from './role-key';
import {
  RoleKeyActionType,
  RoleKeyReducerAction,
} from './role-key-editing-context';

export type RoleKeysState = {
  saved: ReduxFriendlyStringMap<RoleKey>;
  editingId: string | undefined;
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
    case RoleKeyActionType.CHANGE_VALUE:
      return { ...state, value: action.payload };
    default:
      throw new UnhandledRoleKeyEditingEventTypeError(action.type);
  }
};
