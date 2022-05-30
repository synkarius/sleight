import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getOrThrow } from '../../../util/functions';
import { createSelectorItem, DeleteSelectorItemPayload, EditSelectorItemPayload, Selector } from './selector';

type Selectors = {
    saved: Map<string, Selector>
    editing: Map<string, Selector>
}

const initialState: Selectors = {
    saved: new Map<string, Selector>(),
    editing: new Map<string, Selector>()
}

const findSelector = (state:Selectors, selectorId:string) => {
    return getOrThrow([
        () => state.editing.get(selectorId),
        () => state.saved.get(selectorId)],
        () => new Error("selector id not found: " + selectorId));
}

const selectorsSlice = createSlice({
    name: "selectors",
    initialState,
    reducers: {
        /*
         * When a selector is created, it is not immediately "saved". This is because
         * there can be multiple selector components onscreen at the same time. So,
         * instead, it is added to the "editing" group and saved to the "saved" group
         * later.
        */
        createNewEditingSelector: (state, action:PayloadAction<Selector>) => {
            const selector = action.payload;
            // TODO: move this validation somewhere else, but call it here
            if (state.editing.has(selector.id) || state.saved.has(selector.id)) {
                throw new Error("selector id already used");
            }
            state.editing.set(selector.id, selector);
        },
        saveEditingSelector: (state, action:PayloadAction<string>) => {
            const selectorId = action.payload;
            const selector = state.editing.get(selectorId);
            if (selector) {
                state.editing.delete(selectorId);
                state.saved.set(selectorId, selector);
            }
        },
        clearEditingSelectors: (state) => {
            state.editing.clear();
        },
        deleteSelector: (state, action:PayloadAction<string>) => {
            const selectorId = action.payload;
            state.saved.delete(selectorId);
        },
        createNewSelectorItem: (state, action:PayloadAction<string>) => {
            const selector = findSelector(state, action.payload);
            selector.items = [...selector.items, createSelectorItem()];
        },
        editSelectorItem: (state, action:PayloadAction<EditSelectorItemPayload>) => {
            const selector = findSelector(state, action.payload.selectorId);
            const selectorItem = selector.items.find(
                selectorItem => selectorItem.id == action.payload.selectorItemId);
            if (selectorItem) {
                selectorItem.value = action.payload.value;
            }
        },
        deleteSelectorItem: (state, action:PayloadAction<DeleteSelectorItemPayload>) => {
            const selector = findSelector(state, action.payload.selectorId);
            selector.items = selector.items.filter(
                selectorItem => selectorItem.id !== action.payload.selectorItemId);
        }
    }
});

export const { 
    createNewEditingSelector,
    saveEditingSelector,
    clearEditingSelectors,
    deleteSelector,
    createNewSelectorItem,
    editSelectorItem,
    deleteSelectorItem
} = selectorsSlice.actions;
export const selectorReducer = selectorsSlice.reducer;