import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { focusReducer } from '../features/menu/focus/focus-reducers';
import { actionReduxReducer } from '../features/model/action/action-reducers';
import { commandReducer } from '../features/model/command/command-reducers';
import { contextReducer } from '../features/model/context/context-reducers';
import { variableReducer } from '../features/model/variable/variable-reducers';
import { roleKeyReduxReducer } from '../features/model/role-key/role-key-reducers';
import { selectorReducer } from '../features/model/selector/selector-reducers';
import { specReducer } from '../features/model/spec/spec-reducers';

export const store = configureStore({
  reducer: {
    action: actionReduxReducer,
    command: commandReducer,
    context: contextReducer,
    counter: counterReducer,
    focus: focusReducer,
    roleKey: roleKeyReduxReducer,
    selector: selectorReducer,
    spec: specReducer,
    variable: variableReducer,
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
