import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ELEMENT_EDITOR_PATH } from '../../../../core/common/consts';
import { ElementType } from '../../../../data/model/element-types';
import { ActionComponent } from '../../../model/action/ActionComponent';
import { CommandComponent } from '../../../model/command/CommandComponent';
import { ContextComponent } from '../../../model/context/ContextComponent';
import { SpecParentComponent } from '../../../model/spec/SpecComponent';
import { VariableParentComponent } from '../../../model/variable/VariableComponent';
import {
  getEditorCreatePath,
  getEditorEditPath,
} from '../../../navigation/router-fns';
import { RouterV6WorkaroundComponent } from '../RouterV6WorkaroundComponent';

export const EditorComponent: React.FC<{}> = () => {
  const navigate = useNavigate();
  const closeFn = () => navigate(ELEMENT_EDITOR_PATH);
  return (
    <Routes>
      <Route
        path={getEditorCreatePath(ElementType.Enum.ACTION)}
        element={
          <ActionComponent
            key={undefined}
            actionId={undefined}
            closeFn={closeFn}
          />
        }
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.ACTION)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const actionId = params['actionId'];
              return (
                <ActionComponent
                  key={actionId}
                  actionId={actionId}
                  closeFn={closeFn}
                />
              );
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.COMMAND)}
        element={
          <CommandComponent
            key={undefined}
            commandId={undefined}
            closeFn={closeFn}
          />
        }
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.COMMAND)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const commandId = params['commandId'];
              return (
                <CommandComponent
                  key={commandId}
                  commandId={commandId}
                  closeFn={closeFn}
                />
              );
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.CONTEXT)}
        element={
          <ContextComponent
            key={undefined}
            contextId={undefined}
            closeFn={closeFn}
          />
        }
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.CONTEXT)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const contextId = params['contextId'];
              return (
                <ContextComponent
                  key={contextId}
                  contextId={contextId}
                  closeFn={closeFn}
                />
              );
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.SPEC)}
        element={
          <SpecParentComponent
            key={undefined}
            specId={undefined}
            closeFn={closeFn}
          />
        }
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.SPEC)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const specId = params['specId'];
              return (
                <SpecParentComponent
                  key={specId}
                  specId={specId}
                  closeFn={closeFn}
                />
              );
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.VARIABLE)}
        element={
          <VariableParentComponent
            key={undefined}
            variableId={undefined}
            closeFn={closeFn}
          />
        }
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.VARIABLE)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const variableId = params['variableId'];
              return (
                <VariableParentComponent
                  key={variableId}
                  variableId={variableId}
                  closeFn={closeFn}
                />
              );
            }}
          />
        }
      />
    </Routes>
  );
};
