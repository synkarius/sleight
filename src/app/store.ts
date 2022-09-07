import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { editorFocusReducer } from '../ui/other-components/menu/editor/editor-focus-reducers';
import { actionReduxReducer } from '../core/reducers/action-reducers';
import { commandReduxReducer } from '../core/reducers/command-reducers';
import { contextReduxReducer } from '../core/reducers/context-reducers';
import { variableReduxReducer } from '../core/reducers/variable-reducers';
import { selectorReduxReducer } from '../core/reducers/selector-reducers';
import { specReduxReducer } from '../core/reducers/spec-reducers';

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
