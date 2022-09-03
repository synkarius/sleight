import { getRandomId } from '../../../../util/random-id';
import { Ided } from '../../../domain';

/**
 * A string with a role key; represents a single spoken
 * word or phrase.
 */
export interface SelectorItem extends Ided {
  readonly value: string;
}

/**
 * A group of selector items. All selector items in
 * a group are alternates. One can be said in place of
 * another.
 */
export interface Selector extends Ided {
  readonly items: SelectorItem[];
}

export const createSelectorItem = (): SelectorItem => {
  return {
    id: getRandomId(),
    value: '',
  };
};

export const createSelector = (): Selector => {
  return {
    id: getRandomId(),
    items: [createSelectorItem()],
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
