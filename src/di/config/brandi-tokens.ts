import { ActionDomainMapperDelegate } from '../../core/mappers/action-mapper-delegates/action-domain-mapper-delegate';
import {
  ChoiceItemDomainMapper,
  ChoiceVariableDomainMapper,
} from '../../core/mappers/choice-variable-domain-mapper';
import { DomainMapper } from '../../core/mappers/mapper';
import { SpecDomainMapper } from '../../core/mappers/spec-domain-mapper';
import { VariableDomainMapper } from '../../core/mappers/variable-domain-mapper';
import { Exporter } from '../../data/exports/exporter';
import { ImportDataMerger } from '../../data/imports/import-data-merger';
import { ElementEvaluator } from '../../data/imports/model-update/evaluators/element-evaluator';
import { Action } from '../../data/model/action/action';
import { Command } from '../../data/model/command/command';
import { Context } from '../../data/model/context/context';
import {
  Selector,
  SelectorItem,
} from '../../data/model/selector/selector-domain';
import {
  SelectorDTO,
  SelectorItemDTO,
} from '../../data/model/selector/selector-dto';
import { Spec } from '../../data/model/spec/spec-domain';
import { SpecDTO } from '../../data/model/spec/spec-dto';
import {
  RangeVariable,
  TextVariable,
  Variable,
} from '../../data/model/variable/variable';
import {
  RangeVariableDTO,
  TextVariableDTO,
  VariableDTO,
} from '../../data/model/variable/variable-dto';
import { FieldValidator } from '../../validation/field-validator';
import { VariableExtractorDelegate } from '../../validation/variable-extraction/variable-extractor-delegate';
import { tag, token } from 'brandi';
import { FormatMapper } from '../../data/data-format-mapper';
import { Deserializer } from '../../data/imports/deserializer';
import { SpecItemDomainMapper } from '../../core/mappers/spec-item-domain-mapper';
import { ImportsValidator } from '../../data/imports/imports-validator';
import { VariableExtractor } from '../../validation/variable-extraction/variable-extractor';
import { IdedAndActionTyped } from '../../core/default-namers/action-default-namer';
import { DefaultNamer } from '../../core/default-namers/default-namer';
import { Ided } from '../../data/model/domain';
import { IdedAndContextTyped } from '../../core/default-namers/context-default-namer';
import { IdedAndVariableTyped } from '../../core/default-namers/variable-default-namer';
import { Cleaner } from '../../core/cleaners/cleaner';
import { ImportsCleaner } from '../../data/imports/imports-cleaner';
import { IdRewriter } from '../../data/imports/model-update/id-rewriter/id-rewriter';
import {
  ActionIdRewriterArray,
  ContextIdRewriterArray,
  DragonflyActionPrinterDelegateArray,
  SelectorIdRewriterArray,
  SpecIdRewriterArray,
  VariableIdRewriterArray,
} from '../di-collection-types';
import { SleightDataIdsRewriter } from '../../data/imports/model-update/id-rewriter/sleight-data-ids-rewriter';
import { SleightDataEvaluator } from '../../data/imports/model-update/evaluators/sleight-data-evaluator';
import { RoleKeyedDataUpdater } from '../../data/imports/model-update/rolekeyed-data-updater';
import { ActionVariableIdsRewriterDelegate } from '../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/action-variable-ids-rewriter-delegate';
import { ElementPrinter } from '../../data/exports/dragonfly/element-printers/element-printer';
import { ElementTokenPrinter } from '../../data/exports/element-token-printer';
import { DragonflyMustacheFnsFactory } from '../../data/exports/dragonfly/dragonfly-mustache-helper-fns';
import { DragonflyActionPrinterDelegate } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/action-printer-delegate';
import { DragonflyBringAppPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-bring-app-action-printer-delegate';
import { DragonflyPausePrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-pause-action-printer-delegate';
import { DragonflyActionValueResolver } from '../../data/exports/dragonfly/element-printers/action-value/dragonfly-action-value-resolver';
import { DragonflyCallFunctionPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-call-function-action-printer-delegate';
import { DragonflyMimicPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-mimic-action-printer-delegate';
import { DragonflyMousePrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-mouse-action-printer-delegate';
import { DragonflySendKeyPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-send-key-action-printer-delegate';
import { DragonflySendTextPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-send-text-action-printer-delegate';
import { DragonflyWaitForWindowPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-wait-for-window-action-printer-delegate';
import { DelegatingActionValueUpdater } from '../../core/reducers/action-value/action-value-reducer-updaters/delegating-action-value-updater';
import { ActionValueUpdaterDelegate } from '../../core/reducers/action-value/action-value-reducer-updaters/action-value-updater-delegate';
import { ActionValueUpdater } from '../../core/reducers/action-value/action-value-reducer-updaters/action-value-updater';

/** Dependency injection tokens. */
export namespace Tokens {
  export const FormatMapper = token<FormatMapper>('FormatMapper');
  export const Deserializer = token<Deserializer>('Deserializer');
  export const ActionEvaluator =
    token<ElementEvaluator<Action>>('ActionEvaluator');
  export const CommandEvaluator =
    token<ElementEvaluator<Command>>('CommandEvaluator');
  export const ContextEvaluator =
    token<ElementEvaluator<Context>>('ContextEvaluator');
  export const SelectorEvaluator =
    token<ElementEvaluator<SelectorDTO>>('SelectorEvaluator');
  export const SpecEvaluator =
    token<ElementEvaluator<SpecDTO>>('SpecEvaluator');
  export const VariableEvaluator =
    token<ElementEvaluator<VariableDTO>>('VariableEvaluator');
  export const SleightDataEvaluator = token<SleightDataEvaluator>(
    'SleightDataEvaluator'
  );
  export const RoleKeyedDataUpdater = token<RoleKeyedDataUpdater>(
    'RoleKeyedDataUpdater'
  );
  export const DataMerger = token<ImportDataMerger>('DataMerger');
  export const JsonExporter = token<Exporter>('JsonExporter');
  export const DragonflyExporter = token<Exporter>('DragonflyExporter');
  export const Validators_Action =
    token<FieldValidator<Action>[]>('Validators_Action');
  export const Validators_Command =
    token<FieldValidator<Command>[]>('Validators_Command');
  export const Validators_Context =
    token<FieldValidator<Context>[]>('Validators_Context');
  export const Validators_Spec =
    token<FieldValidator<Spec>[]>('Validators_Spec');
  export const Validators_Variable = token<FieldValidator<Variable>[]>(
    'Validators_Variable'
  );
  // mapper dependencies
  export const ActionDomainMapperDelegates = token<
    ActionDomainMapperDelegate[]
  >('ActionDomainMapperDelegates');
  export const VariableMapperDelegate_Text = token<
    DomainMapper<TextVariable, TextVariableDTO>
  >('VariableMapperDelegate_Text');
  export const VariableMapperDelegate_Range = token<
    DomainMapper<RangeVariable, RangeVariableDTO>
  >('VariableMapperDelegate_Range');
  export const VariableMapperDelegate_Choice =
    token<ChoiceVariableDomainMapper>('VariableMapperDelegate_Choice');
  export const ChoiceItemDomainMapper = token<ChoiceItemDomainMapper>(
    'ChoiceItemDomainMapper'
  );
  export const SelectorItemDomainMapper = token<
    DomainMapper<SelectorItem, SelectorItemDTO>
  >('SelectorItemDomainMapper');
  export const SpecItemDomainMapper = token<SpecItemDomainMapper>(
    'SpecItemDomainMapper'
  );
  // mappers
  export const DomainMapper_Action = token<DomainMapper<Action, Action>>(
    'DomainMapper_Action'
  );
  export const DomainMapper_Command = token<DomainMapper<Command, Command>>(
    'DomainMapper_Command'
  );
  export const DomainMapper_Context = token<DomainMapper<Context, Context>>(
    'DomainMapper_Context'
  );
  export const DomainMapper_Selector = token<
    DomainMapper<Selector, SelectorDTO>
  >('DomainMapper_Selector');
  export const DomainMapper_Spec = token<SpecDomainMapper>('DomainMapper_Spec');
  export const DomainMapper_Variable = token<VariableDomainMapper>(
    'DomainMapper_Variable'
  );
  //
  export const ImportsValidator = token<ImportsValidator>('ImportsValidator');
  export const VariableExtractorDelegates = token<VariableExtractorDelegate[]>(
    'VariableExtractorDelegates'
  );
  export const VariableExtractor =
    token<VariableExtractor>('VariableExtractor');
  // default namers
  export const DefaultNamer_Action = token<DefaultNamer<IdedAndActionTyped>>(
    'DefaultNamer_Action'
  );
  export const DefaultNamer_Command = token<DefaultNamer<Ided>>(
    'DefaultNamer_Command'
  );
  export const DefaultNamer_Context = token<DefaultNamer<IdedAndContextTyped>>(
    'DefaultNamer_Context'
  );
  export const DefaultNamer_Spec =
    token<DefaultNamer<Ided>>('DefaultNamer_Spec');
  export const DefaultNamer_Variable = token<
    DefaultNamer<IdedAndVariableTyped>
  >('DefaultNamer_Variable');
  // cleaners
  export const Cleaner_Action = token<Cleaner<Action>>('Cleaner_Action');
  export const Cleaner_Command = token<Cleaner<Command>>('Cleaner_Command');
  export const Cleaner_Context = token<Cleaner<Context>>('Cleaner_Context');
  export const Cleaner_Selector =
    token<Cleaner<SelectorDTO>>('Cleaner_Selector');
  export const Cleaner_Spec = token<Cleaner<SpecDTO>>('Cleaner_Spec');
  export const Cleaner_Variable =
    token<Cleaner<VariableDTO>>('Cleaner_Variable');
  export const ImportsCleaner = token<ImportsCleaner>('ImportsCleaner');
  // id rewriters
  export const ActionIdRewriterArray = token<ActionIdRewriterArray>(
    'ActionIdRewriterArray'
  );
  export const ActionIdRewriter = token<IdRewriter<Action>>('ActionIdRewriter');
  export const ActionIdWithinCommandsRewriter = token<IdRewriter<Action>>(
    'ActionIdWithinCommandsRewriter'
  );
  export const CommandIdRewriter =
    token<IdRewriter<Command>>('CommandIdRewriter');
  export const ContextIdRewriter =
    token<IdRewriter<Context>>('ContextIdRewriter');
  export const ContextIdWithinCommandsRewriter = token<IdRewriter<Context>>(
    'ContextIdWithinCommandsRewriter'
  );
  export const ContextIdRewriterArray = token<ContextIdRewriterArray>(
    'ContextIdRewriterArray'
  );
  export const SelectorIdRewriter =
    token<IdRewriter<SelectorDTO>>('SelectorIdRewriter');
  export const SelectorIdWithinSpecsRewriter = token<IdRewriter<SelectorDTO>>(
    'SelectorIdWithinSpecsRewriter'
  );
  export const SelectorIdWithinVariablesRewriter = token<
    IdRewriter<SelectorDTO>
  >('SelectorIdWithinVariablesRewriter');
  export const SelectorIdRewriterArray = token<SelectorIdRewriterArray>(
    'SelectorIdRewriterArray'
  );
  export const SpecIdRewriter = token<IdRewriter<SpecDTO>>('SpecIdRewriter');
  export const SpecIdWithinCommandsRewriter = token<IdRewriter<SpecDTO>>(
    'SpecIdWithinCommandsRewriter'
  );
  export const SpecIdRewriterArray = token<SpecIdRewriterArray>(
    'SpecIdRewriterArray'
  );
  export const VariableIdRewriter =
    token<IdRewriter<VariableDTO>>('VariableIdRewriter');
  export const ActionVariableIdsRewriterDelegates = token<
    ActionVariableIdsRewriterDelegate[]
  >('ActionVariableIdsRewriterDelegates');
  export const VariableIdWithinActionsRewriter = token<IdRewriter<VariableDTO>>(
    'VariableIdWithinActionsRewriter'
  );
  export const VariableIdWithinSpecsRewriter = token<IdRewriter<VariableDTO>>(
    'VariableIdWithinSpecsRewriter'
  );
  export const VariableIdRewriterArray = token<VariableIdRewriterArray>(
    'VariableIdRewriterArray'
  );
  export const SleightDataIdsRewriter = token<SleightDataIdsRewriter>(
    'SleightDataIdsRewriter'
  );
  export const ElementTokenPrinter = token<ElementTokenPrinter>(
    'ElementTokenPrinter'
  );
  export const DragonElementPrinter_Action = token<ElementPrinter<Action>>(
    'DragonElementPrinter_Action'
  );
  export const DragonElementPrinter_Command = token<ElementPrinter<Command>>(
    'DragonElementPrinter_Command'
  );
  export const DragonElementPrinter_Context = token<ElementPrinter<Context>>(
    'DragonElementPrinter_Context'
  );
  export const DragonElementPrinter_Selector = token<
    ElementPrinter<SelectorDTO>
  >('DragonElementPrinter_Selector');
  export const DragonElementPrinter_Spec = token<ElementPrinter<SpecDTO>>(
    'DragonElementPrinter_Spec'
  );
  export const DragonElementPrinter_Variable = token<
    ElementPrinter<VariableDTO>
  >('DragonElementPrinter_Variable');
  export const DragonflyMustacheFnsFactory = token<DragonflyMustacheFnsFactory>(
    'DragonflyMustacheFnsFactory'
  );
  export const DragonflyActionValueResolver =
    token<DragonflyActionValueResolver>('DragonflyActionValueResolver');
  export const DragonflyActionPrinterDelegateArray =
    token<DragonflyActionPrinterDelegateArray>(
      'DragonflyActionPrinterDelegateArray'
    );
  export const DragonflyBringAppPrinter = token<DragonflyBringAppPrinter>(
    'DragonflyBringAppPrinter'
  );
  export const DragonflyCallFunctionPrinter =
    token<DragonflyCallFunctionPrinter>('DragonflyCallFunctionPrinter');
  export const DragonflyMimicPrinter = token<DragonflyMimicPrinter>(
    'DragonflyMimicPrinter'
  );
  export const DragonflyMousePrinter = token<DragonflyMousePrinter>(
    'DragonflyMousePrinter'
  );
  export const DragonflyPausePrinter = token<DragonflyPausePrinter>(
    'DragonflyPausePrinter'
  );
  export const DragonflySendKeyPrinter = token<DragonflySendKeyPrinter>(
    'DragonflySendKeyPrinter'
  );
  export const DragonflySendTextPrinter = token<DragonflySendTextPrinter>(
    'DragonflySendTextPrinter'
  );
  export const DragonflyWaitForWindowPrinter =
    token<DragonflyWaitForWindowPrinter>('DragonflyWaitForWindowPrinter');
  export const ActionValueUpdater =
    token<ActionValueUpdater>('ActionValueUpdater');
  export const ActionValueUpdaterDelegates = token<
    ActionValueUpdaterDelegate[]
  >('ActionValueUpdaterDelegate');
}
