import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ElementType } from '../../../common/element-types';
import { ActionParentComponent } from '../../model/action/ActionParentComponent';
import { CommandParentComponent } from '../../model/command/CommandParentComponent';
import { ContextParentComponent } from '../../model/context/ContextParentComponent';
import { SpecParentComponent } from '../../model/spec/SpecParentComponent';
import { VariableParentComponent } from '../../model/variable/VariableParentComponent';

export const EditorComponent: React.FC<{}> = () => {
  const elementType = useAppSelector((state) => state.focus.elementType);
  const actionId = useAppSelector((state) => state.action.editingId);
  const commandId = useAppSelector((state) => state.command.editingId);
  const contextId = useAppSelector((state) => state.context.editingId);
  const specId = useAppSelector((state) => state.spec.editingId);
  const variableId = useAppSelector((state) => state.variable.editingId);

  return (
    <>
      {elementType === ElementType.Enum.ACTION && (
        <ActionParentComponent actionId={actionId} key={actionId} />
      )}
      {elementType === ElementType.Enum.COMMAND && (
        <CommandParentComponent commandId={commandId} key={commandId} />
      )}
      {elementType === ElementType.Enum.CONTEXT && (
        <ContextParentComponent contextId={contextId} key={contextId} />
      )}
      {elementType === ElementType.Enum.SPEC && (
        <SpecParentComponent specId={specId} key={specId} />
      )}
      {elementType === ElementType.Enum.VARIABLE && (
        <VariableParentComponent variableId={variableId} key={variableId} />
      )}
    </>
  );
};
