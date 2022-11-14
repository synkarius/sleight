import { Exporter } from '../exporter';
import { dragonflyTemplate } from './templates/dragonfly-template';
import Mustache from 'mustache';
import { utilViewFunctions } from '../util-mustache-fns';

import { DragonflyMustacheFnsFactory } from './dragonfly-mustache-helper-fns';
import { FormatMapper } from '../../data-format-mapper';
import { SleightDataInternalFormat } from '../../data-formats';
import { DragonflyModelMapper } from './dragonfly-model-mapper';
import { Preferences } from '../../preferences/preferences';

export class DragonflyExporter implements Exporter {
  constructor(
    private formatMapper: FormatMapper,
    private viewFnsFactory: DragonflyMustacheFnsFactory,
    private dragonflyModelMapper: DragonflyModelMapper
  ) {}

  export(data: SleightDataInternalFormat, prefs: Preferences): string[] {
    const model = this.dragonflyModelMapper.mapDataToDragonflyModel(data);
    const render = Mustache.render(dragonflyTemplate, {
      rules: model.rules,
      noopCommandsExist: model.metadata.noopCommandsExist,
      negativizer: prefs.negativizer.selector,
      ...this.formatMapper.internalFormatToArrays(data),
      ...utilViewFunctions,
      ...this.viewFnsFactory.getDragonflyMustacheFns(data, prefs),
    });
    return [render];
  }
}
