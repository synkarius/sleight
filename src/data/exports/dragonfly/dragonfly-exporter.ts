import { Exporter } from '../exporter';
import { dragonflyCompactTemplate } from './dragonfly-compact-template';
import Mustache from 'mustache';

export const dragonflyExporter: Exporter = {
  export: (data) => {
    const render = Mustache.render(dragonflyCompactTemplate, { test: 'asdf' });
    return [render];
  },
};
