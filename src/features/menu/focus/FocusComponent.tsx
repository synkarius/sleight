import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ElementType } from '../../model/common/element-types';
import { ContextComponent } from '../../model/context/ContextComponent';
import { ExtraComponent } from '../../model/extra/ExtraComponent';

export const FocusComponent: React.FC<{}> = () => {
  const elementType = useAppSelector((state) => state.focus.elementType);
  const context = useAppSelector((state) => state.context.focused);
  const variable = useAppSelector((state) => state.extra.focused);

  return (
    <>
      {elementType === ElementType.CONTEXT && context && (
        <ContextComponent context={context} />
      )}
      {elementType === ElementType.VARIABLE && variable && (
        <ExtraComponent extra={variable} />
      )}
    </>
  );
};
