import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CreateSelectorItemPayload,
  DeleteSelectorItemPayload,
  EditSelectorItemPayload,
} from '../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../data/model/selector/selector-dto';

export type SelectorsState = {
  readonly saved: Record<string, SelectorDTO>;
};

const initialState: SelectorsState = {
  saved: {},
};

const selectorsSlice = createSlice({
  name: 'selectors',
  initialState,
  reducers: {
    saveSelector: (state, action: PayloadAction<SelectorDTO>) => {
      state.saved[action.payload.id] = action.payload;
    },
    deleteSelector: (state, action: PayloadAction<string>) => {
      const selectorId = action.payload;
      delete state.saved[selectorId];
    },
    setSelectors: (
      state,
      action: PayloadAction<Record<string, SelectorDTO>>
    ) => {
      state.saved = action.payload;
    },
    createNewSelectorItem: (
      state,
      action: PayloadAction<CreateSelectorItemPayload>
    ) => {
      const selector = state.saved[action.payload.selectorId];
      if (selector) {
        state.saved[action.payload.selectorId] = {
          ...selector,
          items: [...selector.items, action.payload.selectorItem],
        };
      }
    },
    editSelectorItem: (
      state,
      action: PayloadAction<EditSelectorItemPayload>
    ) => {
      const selector = state.saved[action.payload.selectorId];
      if (selector) {
        state.saved[action.payload.selectorId] = {
          ...selector,
          items: selector.items.map((item) => {
            if (item.id === action.payload.selectorItemId) {
              return {
                ...item,
                value: action.payload.value,
              };
            }
            return item;
          }),
        };
      }
    },
    deleteSelectorItem: (
      state,
      action: PayloadAction<DeleteSelectorItemPayload>
    ) => {
      const selector = state.saved[action.payload.selectorId];
      if (selector) {
        state.saved[action.payload.selectorId] = {
          ...selector,
          items: selector.items.filter(
            (item) => item.id !== action.payload.selectorItemId
          ),
        };
      }
    },
  },
});

export const {
  saveSelector,
  deleteSelector,
  setSelectors,
  createNewSelectorItem,
  editSelectorItem,
  deleteSelectorItem,
} = selectorsSlice.actions;
export const selectorReduxReducer = selectorsSlice.reducer;
