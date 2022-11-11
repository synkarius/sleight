import { Container, injected } from 'brandi';
import { DragonflyExporter } from '../../../data/exports/dragonfly/dragonfly-exporter';
import { DefaultDragonflyModelMapper } from '../../../data/exports/dragonfly/dragonfly-model-mapper';
import { JsonExporter } from '../../../data/exports/json-exporter';
import { Tokens } from '../brandi-tokens';

export const bindExporters = (container: Container): void => {
  // json exporter
  container
    .bind(Tokens.JsonExporter)
    .toInstance(JsonExporter)
    .inSingletonScope();
  injected(JsonExporter, Tokens.FormatMapper);
  // dragonfly exporter
  container
    .bind(Tokens.DragonflyExporter)
    .toInstance(DragonflyExporter)
    .inSingletonScope();
  injected(
    DragonflyExporter,
    Tokens.FormatMapper,
    Tokens.DragonflyMustacheFnsFactory,
    Tokens.DragonflyModelMapper
  );
  // dragonfly rule mapper
  container
    .bind(Tokens.DragonflyModelMapper)
    .toInstance(DefaultDragonflyModelMapper)
    .inSingletonScope();
  injected(DefaultDragonflyModelMapper, Tokens.VariableExtractor);
};
