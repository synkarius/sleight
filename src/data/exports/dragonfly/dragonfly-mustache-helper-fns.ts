import { SleightDataInternalFormat } from '../../data-formats';
import { createMustacheFn } from '../util-mustache-fns';

export const dragonflyViewFunctions = (data: SleightDataInternalFormat) => ({
  printSelectorItems: createMustacheFn((id, r) => {
    const selectorId = r(id);
    const selector = data.selectors[selectorId];
    return selector.items.map((item) => item.value).join(' | ');
  }),
});
