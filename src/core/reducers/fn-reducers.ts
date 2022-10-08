import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fn } from '../../data/model/fn/fn';
import { NotImplementedError } from '../../error/not-implemented-error';
import { FnReducerAction } from '../../ui/model/fn/fn-editing-context';

export type FnsState = {
  readonly saved: Record<string, Fn>;
};

const initialState: FnsState = {
  saved: {},
};

const fnsSlice = createSlice({
  name: 'fns',
  initialState,
  reducers: {
    saveFn: (state, action: PayloadAction<Fn>) => {
      state.saved[action.payload.id] = action.payload;
    },
    deleteFn: (state, action: PayloadAction<string>) => {
      delete state.saved[action.payload];
    },
    setFns: (state, action: PayloadAction<Record<string, Fn>>) => {
      state.saved = action.payload;
    },
  },
});

export const { saveFn, deleteFn, setFns } = fnsSlice.actions;
export const fnReduxReducer = fnsSlice.reducer;

export const fnReactReducer = (state: Fn, action: FnReducerAction): Fn => {
  throw new NotImplementedError('fnReactReducer');
};
