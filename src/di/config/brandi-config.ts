import { Container } from 'brandi';
import { bindImportProcessEvaluators } from './bindings/import-process-evaluator-bindings';
import { bindFieldValidators } from './bindings/field-validator-bindings';
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
import { bindCompositeValidators } from './bindings/composite-validators-bindings';
import { bindImportsCleaner } from './bindings/imports-cleaner-bindings';
import { bindSleightDataIdsRewriter } from './bindings/sleight-data-ids-rewriter-bindings';
import { bindRoleKeyedDataUpdater } from './bindings/rolekeyed-data-updater-bindings';
import { bindElementPrinters } from './bindings/element-printer-bindings';
import { bindActionValueUpdater } from './bindings/action-value-updater-bindings';
import { bindCommandCommandListHelper } from './bindings/command-list-helper-bindings';
import { bindSpellValidators } from './bindings/spell-validator-bindings';

export const container = new Container();
[
  bindActionValueUpdater,
  bindCleaners,
  bindCommandCommandListHelper,
  bindCompositeValidators,
  bindDataMerger,
  bindDefaultNamers,
  bindDeserializer,
  bindFieldValidators,
  bindImportProcessEvaluators,
  bindElementPrinters,
  bindExporters,
  bindFormatMapper,
  bindIdRewriters,
  bindImportsCleaner,
  bindMappers,
  bindRoleKeyedDataUpdater,
  bindSleightDataEvaluator,
  bindSleightDataIdsRewriter,
  bindSpellValidators,
  bindVariableExtractor,
].forEach((fn) => fn(container));
