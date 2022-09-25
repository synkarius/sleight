import { Exporter } from '../exporter';
import { dragonflyCompactTemplate } from './dragonfly-compact-template';
import Mustache from 'mustache';
import { utilViewFunctions } from '../util-mustache-fns';

import { dragonflyViewFunctions } from './dragonfly-mustache-helper-fns';
import { FormatMapper } from '../../data-format-mapper';
import { SleightDataInternalFormat } from '../../data-formats';

export class DragonflyExporter implements Exporter {
  constructor(private formatMapper: FormatMapper) {}

  export(data: SleightDataInternalFormat): string[] {
    const render = Mustache.render(dragonflyCompactTemplate, {
      ...this.formatMapper.internalFormatToArrays(data),
      ...utilViewFunctions,
      ...dragonflyViewFunctions(data),
    });
    return [render];
  }
}
