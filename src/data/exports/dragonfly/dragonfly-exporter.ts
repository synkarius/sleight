import { Exporter } from '../exporter';
import { dragonflyTemplate } from './templates/dragonfly-template';
import Mustache from 'mustache';
import { DragonflyMustacheFnsFactory } from './dragonfly-mustache-helper-fns';
import { SleightDataInternalFormat } from '../../data-formats';
import { DragonflyModelMapper } from './dragonfly-model-mapper';
import { Preferences } from '../../preferences/preferences';

export class DragonflyExporter implements Exporter {
  constructor(
    private viewFnsFactory: DragonflyMustacheFnsFactory,
    private dragonflyModelMapper: DragonflyModelMapper
  ) {}

  export(data: SleightDataInternalFormat, prefs: Preferences): string[] {
    const model = this.dragonflyModelMapper.mapDataToDragonflyModel(data);
    const render = Mustache.render(dragonflyTemplate, {
      rules: model.rules,
      importFns: model.fns,
      wrapperFns: [...model.fns, ...model.builtinFns],
      negativizer: prefs.negativizer.selector,
      ...this.viewFnsFactory.getDragonflyMustacheFns(data, prefs),
    });
    return [render];
  }
}
