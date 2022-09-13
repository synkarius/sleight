import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ElementType } from '../../../../data/model/element-types';

type EditorFocusState = {
  elementType?: ElementType.Type;
};

const initialState: EditorFocusState = {
  elementType: undefined,
};

// TODO: unit test this slice
const editorFocusSlice = createSlice({
  name: 'editorFocus',
  initialState,
  reducers: {
    setEditorFocus: (
      state,
      action: PayloadAction<ElementType.Type | undefined>
    ) => {
      state.elementType = action.payload;
    },
  },
});

export const { setEditorFocus } = editorFocusSlice.actions;
export const editorFocusReducer = editorFocusSlice.reducer;