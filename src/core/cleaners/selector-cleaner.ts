import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export const getSelectorMappingCleaner = (): Cleaner<SelectorDTO> => {
  return {
    clean: (selectors) => {
      const injected = getDefaultInjectionContext();
      const selectorMapper = injected.mappers.selector;
      return selectors
        .map((selectorDTO) => selectorMapper.mapToDomain(selectorDTO))
        .map((selector) => selectorMapper.mapFromDomain(selector));
    },
  };
};
