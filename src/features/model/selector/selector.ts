import { getRandomId } from '../../../util/random-id';
import { RoleKeyed, Ided } from '../../domain';

interface BasicIded extends RoleKeyed, Ided {}

export interface SelectorItem extends RoleKeyed, Ided {
  readonly value: string;
}

export interface Selector extends RoleKeyed, Ided {
  readonly items: SelectorItem[];
}

export const createSelectorItem = (): SelectorItem => {
  return {
    roleKeyId: null,
    id: getRandomId(),
    value: '',
  };
};

export const createSelector = (
  fromItems: SelectorItem[] | null = null,
  from: BasicIded | null = null
): Selector => {
  const roleKeyId = from !== null ? from.roleKeyId : null;
  const id = from !== null ? from.id : getRandomId();
  const items = fromItems !== null ? fromItems : [createSelectorItem()];
  return {
    roleKeyId: roleKeyId,
    id: id,
    items: items,
  };
};

export interface CreateSelectorItemPayload {
  readonly selectorId: string;
  readonly selectorItem: SelectorItem;
}

export interface EditSelectorItemPayload {
  readonly selectorId: string;
  readonly selectorItemId: string;
  readonly value: string;
}

export interface DeleteSelectorItemPayload {
  readonly selectorId: string;
  readonly selectorItemId: string;
}
