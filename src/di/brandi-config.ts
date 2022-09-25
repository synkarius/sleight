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
import {
  ActionModelUpdateEvaluator,
  CommandModelUpdateEvaluator,
  ContextModelUpdateEvaluator,
  SpecModelUpdateEvaluator,
  VariableModelUpdateEvaluator,
} from '../data/imports/model-update/model-update-evaluator-factory';
import { DefaultSelectorModelUpdateEvaluator } from '../data/imports/model-update/selector-model-update-evaluator';
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
  .bind(Tokens.ModelUpdateEvaluator_Action)
  .toInstance(ActionModelUpdateEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.ModelUpdateEvaluator_Command)
  .toInstance(CommandModelUpdateEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.ModelUpdateEvaluator_Context)
  .toInstance(ContextModelUpdateEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.ModelUpdateEvaluator_Selector)
  .toInstance(DefaultSelectorModelUpdateEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.ModelUpdateEvaluator_Spec)
  .toInstance(SpecModelUpdateEvaluator)
  .inSingletonScope();
container
  .bind(Tokens.ModelUpdateEvaluator_Variable)
  .toInstance(VariableModelUpdateEvaluator)
  .inSingletonScope();
// data merger
container
  .bind(Tokens.DataMerger)
  .toInstance(CopyingImportDataMerger)
  .inSingletonScope();
injected(
  CopyingImportDataMerger,
  Tokens.ModelUpdateEvaluator_Action,
  Tokens.ModelUpdateEvaluator_Command,
  Tokens.ModelUpdateEvaluator_Context,
  Tokens.ModelUpdateEvaluator_Selector,
  Tokens.ModelUpdateEvaluator_Spec,
  Tokens.ModelUpdateEvaluator_Variable
);
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
