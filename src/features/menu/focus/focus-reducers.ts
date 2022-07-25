import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ElementType } from '../../model/common/element-types';

type Focus = {
  elementType: ElementType.Type | undefined;
};

const initialState: Focus = {
  elementType: undefined,
};

// TODO: unit test this slice
const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    setFocus: (state, action: PayloadAction<ElementType.Type | undefined>) => {
      state.elementType = action.payload;
    },
  },
});

export const { setFocus } = focusSlice.actions;
export const focusReducer = focusSlice.reducer;
