import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { focusReducer } from '../features/menu/focus/focus-reducers';
import { contextReducer } from '../features/model/context/context-reducers';
import { extraReducer } from '../features/model/extra/extra-reducers';
import { selectorReducer } from '../features/model/selector/selector-reducers';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    extra: extraReducer,
    context: contextReducer,
    focus: focusReducer,
    selector: selectorReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
