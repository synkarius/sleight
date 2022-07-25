import { getRandomId } from '../../../util/random-id';
import { Ided, Named, RoleKeyed } from '../../domain';
import { MoveDirection } from '../common/move-direction';
import { SpecItemType } from './spec-item-type';

export interface SpecItem extends Ided {
  readonly itemId: string;
  readonly itemType: SpecItemType.Type;
}

export const createSpecItem = (
  itemId: string,
  itemType: SpecItemType.Type
): SpecItem => {
  return {
    id: getRandomId(),
    itemId: itemId,
    itemType: itemType,
  };
};

export interface Spec extends Named, Ided, RoleKeyed {
  readonly items: SpecItem[];
}

export const createSpec = (selectorId: string): Spec => {
  return {
    id: getRandomId(),
    name: '',
    roleKeyId: null,
    items: [createSpecItem(selectorId, SpecItemType.Enum.SELECTOR)],
  };
};

export type ChangeSpecItemTypePayload = {
  readonly specItemId: string;
  readonly specItemItemId: string;
  readonly specItemItemType: SpecItemType.Type;
};

export type ChangeSpecItemVariableIdPayload = {
  readonly specItemId: string;
  readonly variableId: string;
};

export type ChangeSpecItemOrderPayload = {
  readonly specItemId: string;
  readonly moveDirection: MoveDirection;
};
