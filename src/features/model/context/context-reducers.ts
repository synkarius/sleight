import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { validate, ValidationError } from '../../../validation/validator';
import { Context } from './context';
import { contextMatcherValidator } from './context-validation';

export interface ContextsState {
  saved: ReduxFriendlyStringMap<Context>;
  editing: Context | null;
  validationErrors: ValidationError[];
}

const initialState: ContextsState = {
  saved: {},
  editing: null,
  validationErrors: [],
};

const contextsSlice = createSlice({
  name: 'contexts',
  initialState,
  reducers: {
    createNewEditingContext: (state, action: PayloadAction<Context>) => {
      state.editing = action.payload;
    },
    selectContext: (state, action: PayloadAction<string>) => {
      state.editing = state.saved[action.payload];
    },
    saveAndClearEditingContext: (state) => {
      if (state.editing && state.validationErrors.length === 0) {
        state.saved[state.editing.id] = state.editing;
        state.editing = null;
      }
    },
    clearEditingContext: (state) => {
      state.editing = null;
    },
    changeEditingContextName: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.name = action.payload;
      }
    },
    changeEditingContextRoleKey: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.roleKeyId = action.payload;
      }
    },
    changeEditingContextType: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.type = action.payload;
      }
    },
    changeEditingContextMatcher: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.matcher = action.payload;
      }
    },
    validateEditingContextMatcher: (state) => {
      if (state.editing) {
        validate(
          state.editing.matcher,
          contextMatcherValidator,
          state.validationErrors
        );
      }
    },
  },
});

export const {
  createNewEditingContext,
  selectContext,
  clearEditingContext,
  changeEditingContextName,
  changeEditingContextRoleKey,
  changeEditingContextType,
  changeEditingContextMatcher,
  validateEditingContextMatcher,
  saveAndClearEditingContext,
} = contextsSlice.actions;
export const contextReducer = contextsSlice.reducer;
