import { ElementType } from '../../data/model/element-types';

export const getEditorCreatePath = (elementType: ElementType.Type): string =>
  `${elementType.toLowerCase()}s/create`;

export const getEditorEditPath = (
  elementType: ElementType.Type,
  id?: string
): string => {
  const etLower = elementType.toLowerCase();
  const idParam = id ?? `:${etLower}Id`;
  return `${etLower}s/edit/${idParam}`;
};
