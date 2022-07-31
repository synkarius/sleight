import { getRandomId } from '../../../../util/random-id';
import { Ided, Named, RoleKeyed } from '../../../domain';
import { createSelector, Selector } from '../../selector/data/selector-domain';
import { SpecItemType } from '../spec-item-type';

interface AbstractSpecItem extends Ided {
  readonly itemType: SpecItemType.Type;
}

export interface SelectorSpecItem extends AbstractSpecItem {
  readonly itemType: typeof SpecItemType.Enum.SELECTOR;
  readonly selector: Selector;
}

export interface VariableSpecItem extends AbstractSpecItem {
  readonly itemType: typeof SpecItemType.Enum.VARIABLE;
  readonly variableId: string;
}

export type SpecItem = SelectorSpecItem | VariableSpecItem;

export const createSpecItem = (): SelectorSpecItem => {
  return {
    id: getRandomId(),
    itemType: SpecItemType.Enum.SELECTOR,
    selector: createSelector(),
  };
};

export interface Spec extends Ided, Named, RoleKeyed {
  readonly items: SpecItem[];
}

export const createSpec = () => {
  return {
    id: getRandomId(),
    name: '',
    roleKeyId: undefined,
    items: [],
  };
};
