import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ElementType } from '../../model/common/element-types';
import { ContextComponent } from '../../model/context/ContextComponent';
import { ExtraComponent } from '../../model/extra/ExtraComponent';
import { RoleKeyComponent } from '../../model/role-key/RoleKeyComponent';

export const FocusComponent: React.FC<{}> = () => {
  const elementType = useAppSelector((state) => state.focus.elementType);
  const context = useAppSelector((state) => state.context.editing);
  const roleKey = useAppSelector((state) => state.roleKey.editing);
  const variable = useAppSelector((state) => state.extra.editing);

  return (
    <>
      {elementType === ElementType.CONTEXT && context && (
        <ContextComponent context={context} />
      )}
      {elementType === ElementType.KEY && roleKey && (
        <RoleKeyComponent roleKey={roleKey} />
      )}
      {elementType === ElementType.VARIABLE && variable && (
        <ExtraComponent extra={variable} />
      )}
    </>
  );
};
