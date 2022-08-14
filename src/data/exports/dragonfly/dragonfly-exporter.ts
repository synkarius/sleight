import { Exporter } from '../exporter';
import { dragonflyCompactTemplate } from './dragonfly-compact-template';
import Mustache from 'mustache';
import { utilViewFunctions } from '../util-mustache-fns';
import { convertSleightInternalFormatToKeys } from '../../data-formats';
import { dragonflyViewFunctions } from './dragonfly-mustache-helper-fns';

export const dragonflyExporter: Exporter = {
  export: (data) => {
    const render = Mustache.render(dragonflyCompactTemplate, {
      ...convertSleightInternalFormatToKeys(data),
      ...utilViewFunctions,
      ...dragonflyViewFunctions(data),
    });
    return [render];
  },
};
