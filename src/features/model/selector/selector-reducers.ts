import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import {
  CreateSelectorItemPayload,
  DeleteSelectorItemPayload,
  EditSelectorItemPayload,
} from './data/selector-domain';
import { SelectorDTO } from './data/selector-dto';

export type SelectorsState = {
  readonly saved: ReduxFriendlyStringMap<SelectorDTO>;
  readonly editingId?: string;
};

const initialState: SelectorsState = {
  saved: {},
  editingId: undefined,
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
  createNewSelectorItem,
  editSelectorItem,
  deleteSelectorItem,
} = selectorsSlice.actions;
export const selectorReduxReducer = selectorsSlice.reducer;
