import { Exporter } from '../exporter';
import { dragonflyCompactTemplate } from './dragonfly-compact-template';

export const dragonflyExporter: Exporter = {
  export: (
    actions,
    commands,
    contexts,
    roleKeys,
    selectors,
    specs,
    variables
  ) => {
    return [dragonflyCompactTemplate({ test: 'asdf' })];
  },
};
