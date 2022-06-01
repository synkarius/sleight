import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { focusReducer } from '../features/menu/focus/focus-reducers';
import { contextReducer } from '../features/model/context/context-reducers';
import { extraReducer } from '../features/model/extra/extra-reducers';
import { roleKeyReducer } from '../features/model/role-key/role-key-reducers';
import { selectorReducer } from '../features/model/selector/selector-reducers';
import { specReducer } from '../features/model/spec/spec-reducers';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    extra: extraReducer,
    context: contextReducer,
    focus: focusReducer,
    selector: selectorReducer,
    roleKey: roleKeyReducer,
    spec: specReducer
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
