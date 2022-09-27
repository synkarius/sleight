import { Container, injected } from 'brandi';
import { ActionMappingCleaner } from '../core/cleaners/action-cleaner';
import { CommandMappingCleaner } from '../core/cleaners/command-cleaner';
import { ContextMappingCleaner } from '../core/cleaners/context-cleaner';
import { SelectorMappingCleaner } from '../core/cleaners/selector-cleaner';
import { DefaultSpecCleaner } from '../core/cleaners/spec-cleaner';
import { DefaultVariableCleaner } from '../core/cleaners/variable-cleaner';
import { DefaultActionNamer } from '../core/default-namers/action-default-namer';
import { DefaultCommandNamer } from '../core/default-namers/command-default-namer';
import { DefaultContextNamer } from '../core/default-namers/context-default-namer';
import { DefaultSpecNamer } from '../core/default-namers/spec-default-namer';
import { DefaultVariableNamer } from '../core/default-namers/variable-default-namer';
import { DelegatingActionDomainMapper } from '../core/mappers/action-domain-mapper';
import { getActionDomainMapperDelegates } from '../core/mappers/action-mapper-delegates/action-domain-mapper-delegates';
import {
  DefaultChoiceItemDomainMapper,
  DefaultChoiceVariableDomainMapper,
} from '../core/mappers/choice-variable-domain-mapper';
import { DefaultCommandDomainMapper } from '../core/mappers/command-domain-mapper';
import { DefaultContextDomainMapper } from '../core/mappers/context-domain-mapper';
import { DefaultRangeVariableDomainMapper } from '../core/mappers/range-variable-domain-mapper';
import { DefaultSelectorDomainMapper } from '../core/mappers/selector-domain-mapper';
import { DefaultSelectorItemDomainMapper } from '../core/mappers/selector-item-domain-mapper';
import { DefaultSpecDomainMapper } from '../core/mappers/spec-domain-mapper';
import { DefaultSpecItemDomainMapper } from '../core/mappers/spec-item-domain-mapper';
import { DefaultTextVariableDomainMapper } from '../core/mappers/text-variable-domain-mapper-delegate';
import { DefaultVariableDomainMapper } from '../core/mappers/variable-domain-mapper';
import { getActionValidators } from '../core/validators/action-validators';
import { getBringAppValidators } from '../core/validators/action/bring-app-validators';
import { getCallFunctionValidators } from '../core/validators/action/call-function-validators';
import { getMimicValidators } from '../core/validators/action/mimic-validators';
import { getMouseValidators } from '../core/validators/action/mouse-validators';
import { getPauseValidators } from '../core/validators/action/pause-validators';
import { getSendKeyValidators } from '../core/validators/action/send-key-validators';
import { getSendTextValidators } from '../core/validators/action/send-text-validators';
import { getWaitForWindowValidators } from '../core/validators/action/wait-for-window-validators';
import { getCommandValidators } from '../core/validators/command-validators';
import { getContextValidators } from '../core/validators/context-validators';
import { getSpecValidators } from '../core/validators/spec-validators';
import { getVariableValidators } from '../core/validators/variable-validators';
import { DefaultFormatMapper } from '../data/data-format-mapper';
import { DragonflyExporter } from '../data/exports/dragonfly/dragonfly-exporter';
import { JsonExporter } from '../data/exports/json-exporter';
import { JsonDeserializer } from '../data/imports/deserializer';
import { CopyingImportDataMerger } from '../data/imports/import-data-merger';
import { DefaultImportsCleaner } from '../data/imports/imports-cleaner';
import { DefaultImportsValidator } from '../data/imports/imports-validator';
import { ActionIdRewriter } from '../data/imports/model-update/id-rewriter/action-id-rewriter';
import { VariableIdWithinActionsRewriter } from '../data/imports/model-update/id-rewriter/variable-id-within-actions-rewriter';
import { ActionIdWithinCommandsRewriter } from '../data/imports/model-update/id-rewriter/action-id-within-commands-rewriter';
import { CommandIdRewriter } from '../data/imports/model-update/id-rewriter/command-id-rewriter';
import { ContextIdRewriter } from '../data/imports/model-update/id-rewriter/context-id-rewriter';
import { SelectorIdRewriter } from '../data/imports/model-update/id-rewriter/selector-id-rewriter';
import { SpecIdRewriter } from '../data/imports/model-update/id-rewriter/spec-id-rewriter';
import { VariableIdRewriter } from '../data/imports/model-update/id-rewriter/variable-id-rewriter';
import {
  ActionEvaluator,
  CommandEvaluator,
  ContextEvaluator,
  SpecEvaluator,
  VariableEvaluator,
} from '../data/imports/model-update/evaluators/element-evaluators';
import { DefaultSelectorEvaluator } from '../data/imports/model-update/evaluators/selector-model-update-evaluator';
import {
  getCrossSliceActionValidators,
  getCrossSliceCommandValidators,
  getCrossSliceContextValidators,
  getCrossSliceSpecValidators,
  getCrossSliceVariableValidators,
} from '../validation/cross-slice/cross-slice-validation-fns';
import { DelegatingVariableExtractor } from '../validation/variable-extraction/delegating-variable-extractor';
import { getVariableExtractionDelegates } from '../validation/variable-extraction/variable-extraction-delegates/variable-extraction-delegates';
import { Tokens } from './brandi-tokens';
import {
  ActionIdRewriterArray,
  ContextIdRewriterArray,
  SelectorIdRewriterArray,
  SpecIdRewriterArray,
  VariableIdRewriterArray,
} from './di-collection-types';
import { ContextIdWithinCommandsRewriter } from '../data/imports/model-update/id-rewriter/context-id-within-commands-rewriter';
import { SelectorIdWithinSpecsIdRewriter } from '../data/imports/model-update/id-rewriter/selector-id-within-specs-rewriter';
import { SelectorIdWithinVariablesIdRewriter } from '../data/imports/model-update/id-rewriter/selector-id-within-variables-rewriter';
import { SpecIdWithinCommandsRewriter } from '../data/imports/model-update/id-rewriter/spec-id-within-commands-rewriter';
import { VariableIdWithinSpecsRewriter } from '../data/imports/model-update/id-rewriter/variable-id-within-specs-rewriter';
import { DefaultSleightDataIdsRewriter } from '../data/imports/model-update/id-rewriter/sleight-data-ids-rewriter';
import { DefaultSleightDataEvaluator } from '../data/imports/model-update/evaluators/sleight-data-evaluator';

export const container = new Container();

// format mapper
container
  .bind(Tokens.FormatMapper)
  .toInstance(DefaultFormatMapper)
  .inSingletonScope();
// json deserializer
container
  .bind(Tokens.Deserializer)
  .toInstance(JsonDeserializer)
  .inSingletonScope();
injected(JsonDeserializer, Tokens.FormatMapper);
// model update evaluators
container
  .bind(Tokens.ActionEvaluator)
  .toInstance(ActionEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.CommandEvaluator)
  .toInstance(CommandEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.ContextEvaluator)
  .toInstance(ContextEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.SelectorEvaluator)
  .toInstance(DefaultSelectorEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.SpecEvaluator)
  .toInstance(SpecEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.VariableEvaluator)
  .toInstance(VariableEvaluator)
  .inSingletonScope();
// sleight data evaluator
container
  .bind(Tokens.SleightDataEvaluator)
  .toInstance(DefaultSleightDataEvaluator)
  .inSingletonScope();
injected(
  DefaultSleightDataEvaluator,
  Tokens.ActionEvaluator,
  Tokens.CommandEvaluator,
  Tokens.ContextEvaluator,
  Tokens.SelectorEvaluator,
  Tokens.SpecEvaluator,
  Tokens.VariableEvaluator
);
// data merger
container
  .bind(Tokens.DataMerger)
  .toInstance(CopyingImportDataMerger)
  .inSingletonScope();

// json exporter
container.bind(Tokens.JsonExporter).toInstance(JsonExporter).inSingletonScope();
injected(JsonExporter, Tokens.FormatMapper);
// dragonfly exporter
container
  .bind(Tokens.DragonflyExporter)
  .toInstance(DragonflyExporter)
  .inSingletonScope();
injected(DragonflyExporter, Tokens.FormatMapper);
// action validators
container
  .bind(Tokens.Validators_Action)
  .toConstant([
    ...getActionValidators(),
    ...getCallFunctionValidators(),
    ...getBringAppValidators(),
    ...getMimicValidators(),
    ...getMouseValidators(),
    ...getPauseValidators(),
    ...getSendKeyValidators(),
    ...getSendTextValidators(),
    ...getWaitForWindowValidators(),
    ...getCrossSliceActionValidators(),
  ]);
// command validators
container
  .bind(Tokens.Validators_Command)
  .toConstant([...getCommandValidators(), ...getCrossSliceCommandValidators()]);
// context validators
container
  .bind(Tokens.Validators_Context)
  .toConstant([...getContextValidators(), ...getCrossSliceContextValidators()]);
// spec validators
container
  .bind(Tokens.Validators_Spec)
  .toConstant([...getSpecValidators(), ...getCrossSliceSpecValidators()]);
// variable validators
container
  .bind(Tokens.Validators_Variable)
  .toConstant([
    ...getVariableValidators(),
    ...getCrossSliceVariableValidators(),
  ]);
// action mapper delegates
container
  .bind(Tokens.ActionDomainMapperDelegates)
  .toConstant(getActionDomainMapperDelegates());
// action domain mapper
container
  .bind(Tokens.DomainMapper_Action)
  .toInstance(DelegatingActionDomainMapper)
  .inSingletonScope();
injected(DelegatingActionDomainMapper, Tokens.ActionDomainMapperDelegates);
// command domain mapper
container
  .bind(Tokens.DomainMapper_Command)
  .toInstance(DefaultCommandDomainMapper)
  .inSingletonScope();
// context domain mapper
container
  .bind(Tokens.DomainMapper_Context)
  .toInstance(DefaultContextDomainMapper)
  .inSingletonScope();
// selector item domain mapper
container
  .bind(Tokens.SelectorItemDomainMapper)
  .toInstance(DefaultSelectorItemDomainMapper)
  .inSingletonScope();
// selector domain mapper
container
  .bind(Tokens.DomainMapper_Selector)
  .toInstance(DefaultSelectorDomainMapper)
  .inSingletonScope();
injected(DefaultSelectorDomainMapper, Tokens.SelectorItemDomainMapper);
// spec item domain mapper
container
  .bind(Tokens.SpecItemDomainMapper)
  .toInstance(DefaultSpecItemDomainMapper)
  .inSingletonScope();
injected(DefaultSpecItemDomainMapper, Tokens.DomainMapper_Selector);
// spec domain mapper
container
  .bind(Tokens.DomainMapper_Spec)
  .toInstance(DefaultSpecDomainMapper)
  .inSingletonScope();
injected(DefaultSpecDomainMapper, Tokens.SpecItemDomainMapper);
// text variable domain mapper
container
  .bind(Tokens.VariableMapperDelegate_Text)
  .toInstance(DefaultTextVariableDomainMapper)
  .inSingletonScope();
// range variable domain mapper
container
  .bind(Tokens.VariableMapperDelegate_Range)
  .toInstance(DefaultRangeVariableDomainMapper)
  .inSingletonScope();
// choice item domain mapper
container
  .bind(Tokens.ChoiceItemDomainMapper)
  .toInstance(DefaultChoiceItemDomainMapper)
  .inSingletonScope();
injected(DefaultChoiceItemDomainMapper, Tokens.DomainMapper_Selector);
// choice variable domain mapper
container
  .bind(Tokens.VariableMapperDelegate_Choice)
  .toInstance(DefaultChoiceVariableDomainMapper)
  .inSingletonScope();
injected(DefaultChoiceVariableDomainMapper, Tokens.ChoiceItemDomainMapper);
// variable domain mapper
container
  .bind(Tokens.DomainMapper_Variable)
  .toInstance(DefaultVariableDomainMapper)
  .inSingletonScope();
injected(
  DefaultVariableDomainMapper,
  Tokens.VariableMapperDelegate_Text,
  Tokens.VariableMapperDelegate_Range,
  Tokens.VariableMapperDelegate_Choice
);
// imports validator
container
  .bind(Tokens.ImportsValidator)
  .toInstance(DefaultImportsValidator)
  .inSingletonScope();
injected(
  DefaultImportsValidator,
  Tokens.Validators_Action,
  Tokens.Validators_Command,
  Tokens.Validators_Context,
  Tokens.Validators_Spec,
  Tokens.Validators_Variable,
  Tokens.DomainMapper_Spec,
  Tokens.DomainMapper_Variable
);
// variable extractor delegates
container
  .bind(Tokens.VariableExtractorDelegates)
  .toConstant(getVariableExtractionDelegates());
// variable extractor
container
  .bind(Tokens.VariableExtractor)
  .toInstance(DelegatingVariableExtractor)
  .inSingletonScope();
injected(DelegatingVariableExtractor, Tokens.VariableExtractorDelegates);
// action default namer
container
  .bind(Tokens.DefaultNamer_Action)
  .toInstance(DefaultActionNamer)
  .inSingletonScope();
// command default namer
container
  .bind(Tokens.DefaultNamer_Command)
  .toInstance(DefaultCommandNamer)
  .inSingletonScope();
// context default namer
container
  .bind(Tokens.DefaultNamer_Context)
  .toInstance(DefaultContextNamer)
  .inSingletonScope();
// spec default namer
container
  .bind(Tokens.DefaultNamer_Spec)
  .toInstance(DefaultSpecNamer)
  .inSingletonScope();
// variable default namer
container
  .bind(Tokens.DefaultNamer_Variable)
  .toInstance(DefaultVariableNamer)
  .inSingletonScope();
// action cleaner
container
  .bind(Tokens.Cleaner_Action)
  .toInstance(ActionMappingCleaner)
  .inSingletonScope();
injected(ActionMappingCleaner, Tokens.DomainMapper_Action);
// command cleaner
container
  .bind(Tokens.Cleaner_Command)
  .toInstance(CommandMappingCleaner)
  .inSingletonScope();
injected(CommandMappingCleaner, Tokens.DomainMapper_Command);
// context cleaner
container
  .bind(Tokens.Cleaner_Context)
  .toInstance(ContextMappingCleaner)
  .inSingletonScope();
injected(ContextMappingCleaner, Tokens.DomainMapper_Context);
// selector cleaner
container
  .bind(Tokens.Cleaner_Selector)
  .toInstance(SelectorMappingCleaner)
  .inSingletonScope();
injected(SelectorMappingCleaner, Tokens.DomainMapper_Selector);
// spec cleaner
container
  .bind(Tokens.Cleaner_Spec)
  .toInstance(DefaultSpecCleaner)
  .inSingletonScope();
// variable cleaner
container
  .bind(Tokens.Cleaner_Variable)
  .toInstance(DefaultVariableCleaner)
  .inSingletonScope();
// imports cleaner
container
  .bind(Tokens.ImportsCleaner)
  .toInstance(DefaultImportsCleaner)
  .inSingletonScope();
injected(
  DefaultImportsCleaner,
  Tokens.FormatMapper,
  Tokens.Cleaner_Action,
  Tokens.Cleaner_Command,
  Tokens.Cleaner_Context,
  Tokens.Cleaner_Selector,
  Tokens.Cleaner_Spec,
  Tokens.Cleaner_Variable
);
/* ==================================
 *          Id Rewriters
 * ================================== */
// action id rewriter
container
  .bind(Tokens.ActionIdRewriter)
  .toInstance(ActionIdRewriter)
  .inSingletonScope();
// action ids (in command) rewriter
container
  .bind(Tokens.ActionIdWithinCommandsRewriter)
  .toInstance(ActionIdWithinCommandsRewriter)
  .inSingletonScope();
//
container
  .bind(Tokens.ActionIdRewriterArray)
  .toInstance(ActionIdRewriterArray)
  .inSingletonScope();
injected(
  ActionIdRewriterArray,
  Tokens.ActionIdRewriter,
  Tokens.ActionIdWithinCommandsRewriter
);
// command id rewriter
container
  .bind(Tokens.CommandIdRewriter)
  .toInstance(CommandIdRewriter)
  .inSingletonScope();
// context id rewriter
container
  .bind(Tokens.ContextIdRewriter)
  .toInstance(ContextIdRewriter)
  .inSingletonScope();
// context ids (in commands) rewriter
container
  .bind(Tokens.ContextIdWithinCommandsRewriter)
  .toInstance(ContextIdWithinCommandsRewriter)
  .inSingletonScope();
//
container
  .bind(Tokens.ContextIdRewriterArray)
  .toInstance(ContextIdRewriterArray)
  .inSingletonScope();
// selector id rewriter
container
  .bind(Tokens.SelectorIdRewriter)
  .toInstance(SelectorIdRewriter)
  .inSingletonScope();
// selector ids (within specs) rewriter
container
  .bind(Tokens.SelectorIdWithinSpecsRewriter)
  .toInstance(SelectorIdWithinSpecsIdRewriter)
  .inSingletonScope();
// selector ids (within variables) rewriter
container
  .bind(Tokens.SelectorIdWithinVariablesRewriter)
  .toInstance(SelectorIdWithinVariablesIdRewriter)
  .inSingletonScope();
//
container
  .bind(Tokens.SelectorIdRewriterArray)
  .toInstance(SelectorIdRewriterArray)
  .inSingletonScope();
// spec id rewriter
container
  .bind(Tokens.SpecIdRewriter)
  .toInstance(SpecIdRewriter)
  .inSingletonScope();
// spec ids (within commands) rewriter
container
  .bind(Tokens.SpecIdWithinCommandsRewriter)
  .toInstance(SpecIdWithinCommandsRewriter)
  .inSingletonScope();
//
container
  .bind(Tokens.SpecIdRewriterArray)
  .toInstance(SpecIdRewriterArray)
  .inSingletonScope();
// variable id rewriter
container
  .bind(Tokens.VariableIdRewriter)
  .toInstance(VariableIdRewriter)
  .inSingletonScope();
// variable ids (in action) rewriter
container
  .bind(Tokens.VariableIdWithinActionsRewriter)
  .toInstance(VariableIdWithinActionsRewriter)
  .inSingletonScope();
// variable ids (in specs) rewriter
container
  .bind(Tokens.VariableIdWithinSpecsRewriter)
  .toInstance(VariableIdWithinSpecsRewriter)
  .inSingletonScope();
//
container
  .bind(Tokens.VariableIdRewriterArray)
  .toInstance(VariableIdRewriterArray)
  .inSingletonScope();
// sleight data ids rewriter
container
  .bind(Tokens.SleightDataIdsRewriter)
  .toInstance(DefaultSleightDataIdsRewriter)
  .inSingletonScope();
injected(
  DefaultSleightDataIdsRewriter,
  Tokens.ActionIdRewriterArray,
  Tokens.CommandIdRewriter,
  Tokens.ContextIdRewriterArray,
  Tokens.SelectorIdRewriterArray,
  Tokens.SpecIdRewriterArray,
  Tokens.VariableIdRewriterArray
);
