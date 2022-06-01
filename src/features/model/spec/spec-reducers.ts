import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { Spec } from './spec';

type Specs = {
    saved: ReduxFriendlyStringMap<Spec>
    editing: Spec | null
}

const initialState: Specs = {
    saved: {},
    editing: null
}

const specsSlice = createSlice({
    name: "specs",
    initialState,
    reducers: {
        createNewEditingSpec: (state, action:PayloadAction<Spec>) => {
            state.editing = action.payload;
        },
        selectSpec: (state, action:PayloadAction<string>) => {
            const specId = action.payload;
            state.editing = state.saved[specId];
        },
        saveEditingSpec: (state) => {
            if (state.editing) {
                // TODO: validation
                state.saved[state.editing.id] = state.editing;
            }
        },
        clearEditingSpec: (state) => {
            state.editing = null;
        },
        changeEditingSpecName: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.name = action.payload;
            }
        },
        changeEditingSpecRoleKey: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.roleKeyId = action.payload;
            }
        },
        addSpecItem: (state) => {
            // TODO
        },
        changeSpecItemType: (state) => {
            // TODO
        },
        changeSpecItemTypeId: (state) => {
            // TODO
        },
        deleteSpecItem: (state) => {
            // TODO
        }
    }
});

export const { 
    createNewEditingSpec,
    selectSpec,
    saveEditingSpec,
    clearEditingSpec,
    changeEditingSpecName,
    changeEditingSpecRoleKey,
    addSpecItem,
    changeSpecItemType,
    changeSpecItemTypeId,
    deleteSpecItem
} = specsSlice.actions;
export const specReducer = specsSlice.reducer;