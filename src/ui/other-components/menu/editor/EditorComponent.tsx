import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ELEMENT_EDITOR_PATH } from '../../../../core/common/consts';
import { ElementType } from '../../../../data/model/element-types';
import { ActionParentComponent } from '../../../model/action/ActionParentComponent';
import { CommandParentComponent } from '../../../model/command/CommandParentComponent';
import { ContextParentComponent } from '../../../model/context/ContextParentComponent';
import { SpecParentComponent } from '../../../model/spec/SpecParentComponent';
import { VariableParentComponent } from '../../../model/variable/VariableParentComponent';
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
          <ActionParentComponent
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
                <ActionParentComponent
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
          <CommandParentComponent
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
                <CommandParentComponent
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
          <ContextParentComponent
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
                <ContextParentComponent
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
