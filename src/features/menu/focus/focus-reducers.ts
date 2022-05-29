import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Focus = {
    elementType:string|null
}

const initialState: Focus = {
    elementType: null
}

const focusSlice = createSlice({
    name: "focus",
    initialState,
    reducers: {
        setFocus: (state, action:PayloadAction<string>) => {
            state.elementType = action.payload;
        },
        clearFocus: (state) => {
            state.elementType = null;
        }
    }
});

export const { 
    setFocus,
    clearFocus
} = focusSlice.actions;
export const focusReducer = focusSlice.reducer;