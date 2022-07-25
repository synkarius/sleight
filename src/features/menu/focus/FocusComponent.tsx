import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ElementType } from '../../model/common/element-types';
import { VariableComponent } from '../../model/variable/VariableComponent';
import { SpecComponent } from '../../model/spec/SpecComponent';
import { RoleKeyParentComponent } from '../../model/role-key/RoleKeyParentComponent';
import { ActionParentComponent } from '../../model/action/ActionParentComponent';
import { CommandParentComponent } from '../../model/command/CommandParentComponent';
import { ContextParentComponent } from '../../model/context/ContextParentComponent';

export const FocusComponent: React.FC<{}> = () => {
  const elementType = useAppSelector((state) => state.focus.elementType);
  const actionId = useAppSelector((state) => state.action.editingId);
  const commandId = useAppSelector((state) => state.command.editingId);
  const contextId = useAppSelector((state) => state.context.editingId);
  const roleKeyId = useAppSelector((state) => state.roleKey.editingId);
  const spec = useAppSelector((state) => state.spec.editing);
  const variable = useAppSelector((state) => state.variable.editing);

  return (
    <>
      {elementType === ElementType.Enum.ACTION && (
        <ActionParentComponent actionId={actionId} key={actionId} />
      )}
      {elementType === ElementType.Enum.COMMAND && (
        <CommandParentComponent commandId={commandId} />
      )}
      {elementType === ElementType.Enum.CONTEXT && (
        <ContextParentComponent contextId={contextId} />
      )}
      {elementType === ElementType.Enum.ROLE_KEY && (
        <RoleKeyParentComponent roleKeyId={roleKeyId} key={roleKeyId} />
      )}
      {elementType === ElementType.Enum.SPEC && spec && (
        <SpecComponent spec={spec} />
      )}
      {elementType === ElementType.Enum.VARIABLE && variable && (
        <VariableComponent variable={variable} />
      )}
    </>
  );
};
