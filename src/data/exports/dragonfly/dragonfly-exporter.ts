import { Exporter } from '../exporter';
import { dragonflyCompactTemplate } from './dragonfly-compact-template';
import Mustache from 'mustache';
import { utilViewFunctions } from '../util-mustache-fns';

import { dragonflyViewFunctions } from './dragonfly-mustache-helper-fns';
import { getDefaultInjectionContext } from '../../../di/app-default-injection-context';

export const getDragonflyExporter: () => Exporter = () => ({
  export: (data) => {
    const injected = getDefaultInjectionContext();
    const formatMapper = injected.mappers.dataFormat;
    //
    const render = Mustache.render(dragonflyCompactTemplate, {
      ...formatMapper.internalFormatToArrays(data),
      ...utilViewFunctions,
      ...dragonflyViewFunctions(data),
    });
    return [render];
  },
});
