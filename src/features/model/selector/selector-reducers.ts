import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSelectorItem, DeleteSelectorItemPayload, EditSelectorItemPayload, Selector } from './selector';

type Selectors = {
    selectors: Map<string, Selector>
}

const initialState: Selectors = {
    selectors: new Map<string, Selector>()
}

const selectorsSlice = createSlice({
    name: "selectors",
    initialState,
    reducers: {
        createNewSelector: (state) => {
            const selector = createSelector([createSelectorItem()]);
            state.selectors.set(selector.id, selector);
        },
        createNewSelectorItem: (state, action:PayloadAction<string>) => {
            const selectorId = action.payload;
            const selector = state.selectors.get(selectorId);
            if (selector) {
                selector.items = [...selector.items, createSelectorItem()];
            }
        },
        editSelectorItem: (state, action:PayloadAction<EditSelectorItemPayload>) => {
            const selector = state.selectors.get(action.payload.selectorId);
            if (selector) {
                const selectorItem = selector.items.find(
                    selectorItem => selectorItem.id == action.payload.selectorItemId);
                if (selectorItem) {
                    selectorItem.value = action.payload.value;
                }
            }
        },
        deleteSelectorItem: (state, action:PayloadAction<DeleteSelectorItemPayload>) => {
            const selector = state.selectors.get(action.payload.selectorId);
            if (selector) {
                selector.items = selector.items.filter(
                    selectorItem => selectorItem.id !== action.payload.selectorItemId);
            }
        },
        deleteSelector: (state, action:PayloadAction<string>) => {
            const selectorId = action.payload;
            state.selectors.delete(selectorId);
        }
    }
});

export const { 
    createNewSelector,
    createNewSelectorItem,
    editSelectorItem,
    deleteSelectorItem, 
    deleteSelector
} = selectorsSlice.actions;
export const selectorReducer = selectorsSlice.reducer;