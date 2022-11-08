import { Exporter } from '../exporter';
import { dragonflyCompactTemplate } from './dragonfly-compact-template';
import Mustache from 'mustache';
import { utilViewFunctions } from '../util-mustache-fns';

import { DragonflyMustacheFnsFactory } from './dragonfly-mustache-helper-fns';
import { FormatMapper } from '../../data-format-mapper';
import { SleightDataInternalFormat } from '../../data-formats';
import { DragonflyRuleMapper } from './dragonfly-rule-mapper';

export class DragonflyExporter implements Exporter {
  constructor(
    private formatMapper: FormatMapper,
    private viewFnsFactory: DragonflyMustacheFnsFactory,
    private dragonflyRuleMapper: DragonflyRuleMapper
  ) {}

  export(data: SleightDataInternalFormat): string[] {
    const render = Mustache.render(dragonflyCompactTemplate, {
      rules: this.dragonflyRuleMapper.mapDataToDragonflyRules(data),
      ...this.formatMapper.internalFormatToArrays(data),
      ...utilViewFunctions,
      ...this.viewFnsFactory.getDragonflyMustacheFns(data),
    });
    return [render];
  }
}
