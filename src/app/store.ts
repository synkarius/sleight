import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { focusReducer } from '../features/menu/focus/focus-reducers';
import { actionReduxReducer } from '../features/model/action/action-reducers';
import { commandReduxReducer } from '../features/model/command/command-reducers';
import { contextReduxReducer } from '../features/model/context/context-reducers';
import { variableReducer } from '../features/model/variable/variable-reducers';
import { roleKeyReduxReducer } from '../features/model/role-key/role-key-reducers';
import { selectorReduxReducer } from '../features/model/selector/selector-reducers';
import { specReduxReducer } from '../features/model/spec/spec-reducers';

export const store = configureStore({
  reducer: {
    action: actionReduxReducer,
    command: commandReduxReducer,
    context: contextReduxReducer,
    focus: focusReducer,
    roleKey: roleKeyReduxReducer,
    selector: selectorReduxReducer,
    spec: specReduxReducer,
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
