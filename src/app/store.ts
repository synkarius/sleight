import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { editorFocusReducer } from '../ui/other-components/menu/editor/editor-focus-reducers';
import { actionReduxReducer } from '../ui/model/action/action-reducers';
import { commandReduxReducer } from '../ui/model/command/command-reducers';
import { contextReduxReducer } from '../ui/model/context/context-reducers';
import { variableReduxReducer } from '../ui/model/variable/variable-reducers';
import { selectorReduxReducer } from '../ui/model/selector/selector-reducers';
import { specReduxReducer } from '../ui/model/spec/spec-reducers';

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
