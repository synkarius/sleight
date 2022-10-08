import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
  return (
    <Routes>
      <Route
        path={getEditorCreatePath(ElementType.Enum.ACTION)}
        element={<ActionParentComponent actionId={undefined} key={undefined} />}
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.ACTION)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const actionId = params['actionId'];
              return (
                <ActionParentComponent actionId={actionId} key={actionId} />
              );
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.COMMAND)}
        element={
          <CommandParentComponent commandId={undefined} key={undefined} />
        }
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.COMMAND)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const commandId = params['commandId'];
              return (
                <CommandParentComponent commandId={commandId} key={commandId} />
              );
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.CONTEXT)}
        element={
          <ContextParentComponent contextId={undefined} key={undefined} />
        }
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.CONTEXT)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const contextId = params['contextId'];
              return (
                <ContextParentComponent contextId={contextId} key={contextId} />
              );
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.SPEC)}
        element={<SpecParentComponent specId={undefined} key={undefined} />}
      />
      <Route
        path={getEditorEditPath(ElementType.Enum.SPEC)}
        element={
          <RouterV6WorkaroundComponent
            paramsFn={(params) => {
              const specId = params['specId'];
              return <SpecParentComponent specId={specId} key={specId} />;
            }}
          />
        }
      />
      <Route
        path={getEditorCreatePath(ElementType.Enum.VARIABLE)}
        element={
          <VariableParentComponent variableId={undefined} key={undefined} />
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
                  variableId={variableId}
                  key={variableId}
                />
              );
            }}
          />
        }
      />
    </Routes>
  );
};
