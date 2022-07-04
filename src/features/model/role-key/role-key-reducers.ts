import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { createRoleKey, RoleKey } from './role-key';

type RoleKeys = {
    saved: ReduxFriendlyStringMap<RoleKey>
    editing: RoleKey | null
}

const initialState: RoleKeys = {
    saved: {},
    editing: null
}

const roleKeysSlice = createSlice({
    name: "roleKeys",
    initialState,
    reducers: {
        createNewEditingRoleKey: (state, action:PayloadAction<RoleKey>) => {
            state.editing = action.payload;
        },
        selectRoleKey: (state, action:PayloadAction<string>) => {
            const roleKeyId = action.payload;
            state.editing = state.saved[roleKeyId];
        },
        clearEditingRoleKey: (state) => {
            state.editing = null;
        },
        changeEditingRoleKeyValue: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.value = action.payload;
            }
        },
        saveEditingRoleKey: (state) => {
            if (state.editing) {
                // TODO: validation
                state.saved[state.editing.id] = state.editing;
                state.editing = null;
            }
        },
        deleteEditingRoleKey: (state, action: PayloadAction<string>) => {
            const roleKeyId = action.payload;
            delete state.saved[roleKeyId];
        }
    }
});

export const { 
    createNewEditingRoleKey,
    selectRoleKey,
    clearEditingRoleKey,
    changeEditingRoleKeyValue, 
    saveEditingRoleKey,
    deleteEditingRoleKey
} = roleKeysSlice.actions;
export const roleKeyReducer = roleKeysSlice.reducer;