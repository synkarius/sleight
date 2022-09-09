import { Action } from '../../data/model/action/action';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export const getActionMappingCleaner = (): Cleaner<Action> => {
  return {
    clean: (actions) => {
      const injected = getDefaultInjectionContext();
      const actionMapper = injected.mappers.action;
      return actions
        .map((actionDTO) => actionMapper.mapToDomain(actionDTO))
        .map((action) => actionMapper.mapFromDomain(action));
    },
  };
};
