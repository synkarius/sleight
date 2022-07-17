import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Focus = {
  elementType: string | undefined;
};

const initialState: Focus = {
  elementType: undefined,
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    setFocus: (state, action: PayloadAction<string | undefined>) => {
      state.elementType = action.payload;
    },
  },
});

export const { setFocus } = focusSlice.actions;
export const focusReducer = focusSlice.reducer;
