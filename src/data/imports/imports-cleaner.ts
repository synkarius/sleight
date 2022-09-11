import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { SleightDataArrays, SleightDataInternalFormat } from '../data-formats';

/** Clean data -- should remove values not in format. */
export type ImportsCleaner = {
  cleanData: (data: SleightDataInternalFormat) => SleightDataInternalFormat;
};

export const getImportsCleaner = (): ImportsCleaner => ({
  cleanData: (data) => {
    const injected = getDefaultInjectionContext();
    const formatMapper = injected.mappers.dataFormat;
    //
    const arrays: SleightDataArrays = formatMapper.internalFormatToArrays(data);
    const cleaners = injected.cleaners;
    const cleanedValues: SleightDataArrays = {
      actions: cleaners.action.clean(arrays.actions),
      commands: cleaners.command.clean(arrays.commands),
      contexts: cleaners.context.clean(arrays.contexts),
      selectors: cleaners.selector.clean(arrays.selectors),
      specs: cleaners.spec.clean(arrays.specs),
      variables: cleaners.variable.clean(arrays.variables),
    };
    // convert back to internal format
    const internalFormat = formatMapper.externalFormatToInternal(cleanedValues);
    return internalFormat;
  },
});
