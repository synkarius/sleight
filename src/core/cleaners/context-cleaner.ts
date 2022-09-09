import { Context } from '../../data/model/context/context';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export const getContextMappingCleaner = (): Cleaner<Context> => {
  return {
    clean: (contexts) => {
      const injected = getDefaultInjectionContext();
      const contextMapper = injected.mappers.context;
      return contexts
        .map((contextDTO) => contextMapper.mapToDomain(contextDTO))
        .map((context) => contextMapper.mapFromDomain(context));
    },
  };
};
