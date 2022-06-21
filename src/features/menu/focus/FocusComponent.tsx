import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ActionComponent } from '../../model/action/ActionComponent';
import { ElementType } from '../../model/common/element-types';
import { ContextComponent } from '../../model/context/ContextComponent';
import { ExtraComponent } from '../../model/extra/ExtraComponent';
import { RoleKeyComponent } from '../../model/role-key/RoleKeyComponent';
import { SpecComponent } from '../../model/spec/SpecComponent';

export const FocusComponent: React.FC<{}> = () => {
  const elementType = useAppSelector((state) => state.focus.elementType);
  const action = useAppSelector((state) => state.action.editing);
  const context = useAppSelector((state) => state.context.editing);
  const roleKey = useAppSelector((state) => state.roleKey.editing);
  const spec = useAppSelector((state) => state.spec.editing);
  const variable = useAppSelector((state) => state.extra.editing);

  return (
    <>
      {elementType === ElementType.ACTION && action && (
        <ActionComponent action={action} />
      )}
      {elementType === ElementType.CONTEXT && context && (
        <ContextComponent context={context} />
      )}
      {elementType === ElementType.ROLE_KEY && roleKey && (
        <RoleKeyComponent roleKey={roleKey} />
      )}
      {elementType === ElementType.SPEC && spec && (
        <SpecComponent spec={spec} />
      )}
      {elementType === ElementType.VARIABLE && variable && (
        <ExtraComponent extra={variable} />
      )}
    </>
  );
};
