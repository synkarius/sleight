import { ElementType } from '../../data/model/element-types';
import { ResourceType } from '../../data/model/resource-types';

type StringEnumType = ElementType.Type | ResourceType.Type;

export const getEditorCreatePath = (type: StringEnumType): string =>
  `${type.toLowerCase()}s/create`;

export const getEditorEditPath = (
  type: StringEnumType,
  id?: string
): string => {
  const etLower = type.toLowerCase();
  const idParam = id ?? `:${etLower}Id`;
  return `${etLower}s/edit/${idParam}`;
};
