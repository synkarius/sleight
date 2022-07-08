import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { validate } from '../../../validation/validator';
import { RoleKey } from './role-key';
import {
  roleKeyTextValidator,
  RoleKeyValidationError,
} from './role-key-validation';

export type RoleKeysState = {
  saved: ReduxFriendlyStringMap<RoleKey>;
  editing: RoleKey | null;
  validationErrors: RoleKeyValidationError[];
};

const initialState: RoleKeysState = {
  saved: {},
  editing: null,
  validationErrors: [],
};

const roleKeysSlice = createSlice({
  name: 'roleKeys',
  initialState,
  reducers: {
    createNewEditingRoleKey: (state, action: PayloadAction<RoleKey>) => {
      state.editing = action.payload;
    },
    selectRoleKey: (state, action: PayloadAction<string>) => {
      const roleKeyId = action.payload;
      state.editing = state.saved[roleKeyId];
    },
    saveAndClearEditingRoleKey: (state) => {
      if (state.editing && state.validationErrors.length === 0) {
        state.saved[state.editing.id] = state.editing;
        state.editing = null;
      }
    },
    clearEditingRoleKey: (state) => {
      state.editing = null;
    },
    validateRoleKeyText: (state) => {
      if (state.editing) {
        validate(
          state.editing.value,
          roleKeyTextValidator,
          state.validationErrors
        );
      }
    },
    changeEditingRoleKeyValue: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.value = action.payload;
      }
    },
    deleteEditingRoleKey: (state, action: PayloadAction<string>) => {
      const roleKeyId = action.payload;
      delete state.saved[roleKeyId];
    },
  },
});

export const {
  createNewEditingRoleKey,
  selectRoleKey,
  clearEditingRoleKey,
  changeEditingRoleKeyValue,
  saveAndClearEditingRoleKey,
  deleteEditingRoleKey,
  validateRoleKeyText,
} = roleKeysSlice.actions;
export const roleKeyReducer = roleKeysSlice.reducer;
