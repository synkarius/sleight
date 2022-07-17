import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ActionComponent } from '../../model/action/ActionComponent';
import { CommandComponent } from '../../model/command/CommandComponent';
import { ElementType } from '../../model/common/element-types';
import { ContextComponent } from '../../model/context/ContextComponent';
import { VariableComponent } from '../../model/variable/VariableComponent';
import { SpecComponent } from '../../model/spec/SpecComponent';
import { RoleKeyParentComponent } from '../../model/role-key/RoleKeyParentComponent';

export const FocusComponent: React.FC<{}> = () => {
  const elementType = useAppSelector((state) => state.focus.elementType);
  const action = useAppSelector((state) => state.action.editing);
  const command = useAppSelector((state) => state.command.editing);
  const context = useAppSelector((state) => state.context.editing);
  const roleKeyId = useAppSelector((state) => state.roleKey.editingId);
  const spec = useAppSelector((state) => state.spec.editing);
  const variable = useAppSelector((state) => state.variable.editing);

  return (
    <>
      {elementType === ElementType.ACTION && action && (
        <ActionComponent action={action} />
      )}
      {elementType === ElementType.COMMAND && command && (
        <CommandComponent command={command} />
      )}
      {elementType === ElementType.CONTEXT && context && (
        <ContextComponent context={context} />
      )}
      {elementType === ElementType.ROLE_KEY && (
        <RoleKeyParentComponent roleKeyId={roleKeyId} key={roleKeyId} />
      )}
      {elementType === ElementType.SPEC && spec && (
        <SpecComponent spec={spec} />
      )}
      {elementType === ElementType.VARIABLE && variable && (
        <VariableComponent variable={variable} />
      )}
    </>
  );
};
