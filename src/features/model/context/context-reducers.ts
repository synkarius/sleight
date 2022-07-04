import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { Context } from "./context";

type Contexts = {
    saved: ReduxFriendlyStringMap<Context>,
    editing: Context | null
}

const initialState: Contexts = {
    saved: {},
    editing: null
}

const contextsSlice = createSlice({
    name: "contexts",
    initialState,
    reducers: {
        createNewEditingContext: (state, action:PayloadAction<Context>) => {
            state.editing = action.payload;
        },
        selectContext: (state, action:PayloadAction<string>) => {
            state.editing = state.saved[action.payload];
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
        saveEditingContext: (state) => {
            if (state.editing) {
                // TODO: validation
                state.saved[state.editing.id] = state.editing;
            }
        }
    }
});

export const { 
    createNewEditingContext,
    selectContext,
    clearEditingContext,
    changeEditingContextName, 
    changeEditingContextRoleKey,
    changeEditingContextType,
    changeEditingContextMatcher,
    saveEditingContext
} = contextsSlice.actions;
export const contextReducer = contextsSlice.reducer;