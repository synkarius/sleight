import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectorIdDuplicateError } from '../../../error/SelectorIdDuplicateError';
import { SelectorNotFoundError } from '../../../error/SelectorNotFoundError';
import { ReduxFriendlyStringMap } from '../../../util/structures';
import {
  createSelectorItem,
  CreateSelectorItemPayload,
  DeleteSelectorItemPayload,
  EditSelectorItemPayload,
  Selector,
} from './selector';

export type Selectors = {
  /*
   * allowing for orphaned selectors so as to not have to deal with the complication of
   * a separate "editing" map
   */
  saved: ReduxFriendlyStringMap<Selector>;
};

const findSelector = (state: Selectors, id: string): Selector => {
  const selector = state.saved[id];
  if (selector) {
    return selector;
  }
  throw new SelectorNotFoundError(id);
};

const initialState: Selectors = {
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
      const selector = findSelector(state, action.payload.selectorId);
      selector.items = [...selector.items, action.payload.selectorItem];
    },
    editSelectorItem: (
      state,
      action: PayloadAction<EditSelectorItemPayload>
    ) => {
      const selector = findSelector(state, action.payload.selectorId);
      const selectorItem = selector.items.find(
        (selectorItem) => selectorItem.id === action.payload.selectorItemId
      );
      if (selectorItem) {
        selectorItem.value = action.payload.value;
      }
    },
    deleteSelectorItem: (
      state,
      action: PayloadAction<DeleteSelectorItemPayload>
    ) => {
      const selector = findSelector(state, action.payload.selectorId);
      selector.items = selector.items.filter(
        (selectorItem) => selectorItem.id !== action.payload.selectorItemId
      );
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
