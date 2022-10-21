import { Container } from 'brandi';
import { bindImportProcessEvaluators } from './bindings/import-process-evaluator-bindings';
import { bindValidators } from './bindings/validator-bindings';
import { bindMappers } from './bindings/mapper-bindings';
import { bindDefaultNamers } from './bindings/default-namer-bindings';
import { bindCleaners } from './bindings/cleaner-bindings';
import { bindIdRewriters } from './bindings/id-rewriter-bindings';
import { bindVariableExtractor } from './bindings/variable-extractor-bindings';
import { bindFormatMapper } from './bindings/format-mapper-bindings';
import { bindDeserializer } from './bindings/deserializer-bindings';
import { bindSleightDataEvaluator } from './bindings/sleight-data-evaluator-bindings';
import { bindDataMerger } from './bindings/data-merger-bindings';
import { bindExporters } from './bindings/exporter-bindings';
import { bindImportsValidator } from './bindings/imports-validator-bindings';
import { bindImportsCleaner } from './bindings/imports-cleaner-bindings';
import { bindSleightDataIdsRewriter } from './bindings/sleight-data-ids-rewriter-bindings';
import { bindRoleKeyedDataUpdater } from './bindings/rolekeyed-data-updater-bindings';
import { bindElementPrinters } from './bindings/element-printer-bindings';
import { bindActionValueUpdater } from './bindings/action-value-updater-bindings';
import { bindCommandGridHelper } from './bindings/command-grid-helper-bindings';

export const container = new Container();
[
  bindActionValueUpdater,
  bindCleaners,
  bindCommandGridHelper,
  bindDataMerger,
  bindDefaultNamers,
  bindDeserializer,
  bindImportProcessEvaluators,
  bindElementPrinters,
  bindExporters,
  bindFormatMapper,
  bindIdRewriters,
  bindImportsCleaner,
  bindImportsValidator,
  bindMappers,
  bindRoleKeyedDataUpdater,
  bindSleightDataEvaluator,
  bindSleightDataIdsRewriter,
  bindValidators,
  bindVariableExtractor,
].forEach((fn) => fn(container));
