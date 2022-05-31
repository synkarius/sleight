import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { upsertIded } from '../../domain';
import { 
    Context, createContext
} from "./context";

type Contexts = {
    saved: Context[]
    editing: Context | null
}

const initialState: Contexts = {
    saved: [],
    editing: null
}

const contextsSlice = createSlice({
    name: "contexts",
    initialState,
    reducers: {
        createNewEditingContext: (state) => {
            state.editing = createContext();
        },
        selectContext: (state, action:PayloadAction<string>) => {
            state.editing = state.saved.find(context => context.id === action.payload) as Context;
        },
        clearEditingContext: (state) => {
            state.editing = null;
        },
        changeEditingContextName: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.name = action.payload;
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
        upsertEditingContext: (state) => {
            if (state.editing) {
                // TODO: validation
                state.saved = upsertIded(state.saved, state.editing as Context);
                state.editing = null;
            }
        }
    }
});

export const { 
    createNewEditingContext,
    selectContext,
    clearEditingContext,
    changeEditingContextName, 
    changeEditingContextType,
    changeEditingContextMatcher,
    upsertEditingContext
} = contextsSlice.actions;
export const contextReducer = contextsSlice.reducer;