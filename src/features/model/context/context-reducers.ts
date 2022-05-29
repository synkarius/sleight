import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { upsertIded } from '../../domain';
import { 
    Context, createContext
} from "./context";

type Contexts = {
    contexts: Context[]
    focused: Context | null
}

const initialState: Contexts = {
    contexts: [],
    focused: null
}

const contextsSlice = createSlice({
    name: "contexts",
    initialState,
    reducers: {
        createNewContext: (state) => {
            state.focused = createContext('');
        },
        selectContext: (state, action:PayloadAction<string>) => {
            state.focused = state.contexts.find(context => context.id === action.payload) as Context;
        },
        clearFocusedContext: (state) => {
            state.focused = null;
        },
        editFocusedContextName: (state, action: PayloadAction<string>) => {
            if (state.focused) {
                state.focused.name = action.payload;
            }
        },
        editFocusedContextType: (state, action: PayloadAction<string>) => {
            if (state.focused) {
                state.focused.type = action.payload;
            }
        },
        upsertFocusedContext: (state) => {
            if (state.focused) {
                // TODO: validation
                state.contexts = upsertIded(state.contexts, state.focused as Context);
                state.focused = null;
            }
        }
    }
});

export const { 
    createNewContext,
    selectContext,
    clearFocusedContext,
    editFocusedContextName, 
    editFocusedContextType, 
    upsertFocusedContext
} = contextsSlice.actions;
export const contextReducer = contextsSlice.reducer;