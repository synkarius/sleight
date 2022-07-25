import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectorIdDuplicateError } from '../../../error/SelectorIdDuplicateError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import {
  CreateSelectorItemPayload,
  DeleteSelectorItemPayload,
  EditSelectorItemPayload,
  Selector,
} from './selector';

export type SelectorsState = {
  /*
   * allowing for orphaned selectors so as to not have to deal with the complication of
   * a separate "editing" map
   */
  saved: ReduxFriendlyStringMap<Selector>;
};

const initialState: SelectorsState = {
  saved: {},
};

const selectorsSlice = createSlice({
  name: 'selectors',
  initialState,
  reducers: {
    /*
     * When a selector is created, it is not immediately "saved". This is because
     * there can be multiple selector components onscreen at the same time. So,
     * instead, it is added to the "editing" group and saved to the "saved" group
     * later.
     */
    createNewSelector: (state, action: PayloadAction<Selector>) => {
      const selector = action.payload;
      // TODO: move this validation somewhere else, but call it here
      if (state.saved[selector.id]) {
        throw new SelectorIdDuplicateError(selector.id);
      }
      state.saved[selector.id] = selector;
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
  createNewSelector,
  deleteSelector,
  createNewSelectorItem,
  editSelectorItem,
  deleteSelectorItem,
} = selectorsSlice.actions;
export const selectorReducer = selectorsSlice.reducer;
