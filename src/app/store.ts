import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { editorFocusReducer } from '../features/menu/editor/editor-focus-reducers';
import { actionReduxReducer } from '../features/model/action/action-reducers';
import { commandReduxReducer } from '../features/model/command/command-reducers';
import { contextReduxReducer } from '../features/model/context/context-reducers';
import { variableReduxReducer } from '../features/model/variable/variable-reducers';
import { selectorReduxReducer } from '../features/model/selector/selector-reducers';
import { specReduxReducer } from '../features/model/spec/spec-reducers';

export const store = configureStore({
  reducer: {
    action: actionReduxReducer,
    command: commandReduxReducer,
    context: contextReduxReducer,
    focus: editorFocusReducer,
    selector: selectorReduxReducer,
    spec: specReduxReducer,
    variable: variableReduxReducer,
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
