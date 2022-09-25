import { ActionDomainMapperDelegate } from '../core/mappers/action-mapper-delegates/action-domain-mapper-delegate';
import {
  ChoiceItemDomainMapper,
  ChoiceVariableDomainMapper,
} from '../core/mappers/choice-variable-domain-mapper';
import { DomainMapper } from '../core/mappers/mapper';
import { SpecDomainMapper } from '../core/mappers/spec-domain-mapper';
import { VariableDomainMapper } from '../core/mappers/variable-domain-mapper';
import { Exporter } from '../data/exports/exporter';
import { ImportDataMerger } from '../data/imports/import-data-merger';
import { ModelUpdateEvaluator } from '../data/imports/model-update/model-update-evaluator';
import { SelectorModelUpdateEvaluator } from '../data/imports/model-update/selector-model-update-evaluator';
import { Action } from '../data/model/action/action';
import { Command } from '../data/model/command/command';
import { Context } from '../data/model/context/context';
import { Selector, SelectorItem } from '../data/model/selector/selector-domain';
import {
  SelectorDTO,
  SelectorItemDTO,
} from '../data/model/selector/selector-dto';
import { Spec } from '../data/model/spec/spec-domain';
import { SpecDTO } from '../data/model/spec/spec-dto';
import {
  RangeVariable,
  TextVariable,
  Variable,
} from '../data/model/variable/variable';
import {
  RangeVariableDTO,
  TextVariableDTO,
  VariableDTO,
} from '../data/model/variable/variable-dto';
import { FieldValidator } from '../validation/field-validator';
import { VariableExtractorDelegate } from '../validation/variable-extraction/variable-extractor-delegate';
import { token } from 'brandi';
import { FormatMapper } from '../data/data-format-mapper';
import { Deserializer } from '../data/imports/deserializer';
import { SpecItemDomainMapper } from '../core/mappers/spec-item-domain-mapper';
import { ImportsValidator } from '../data/imports/imports-validator';
import { VariableExtractor } from '../validation/variable-extraction/variable-extractor';
import { IdedAndActionTyped } from '../core/default-namers/action-default-namer';
import { DefaultNamer } from '../core/default-namers/default-namer';
import { Ided } from '../data/model/domain';
import { IdedAndContextTyped } from '../core/default-namers/context-default-namer';
import { IdedAndVariableTyped } from '../core/default-namers/variable-default-namer';
import { Cleaner } from '../core/cleaners/cleaner';
import { ImportsCleaner } from '../data/imports/imports-cleaner';
import { IdRewriter } from '../data/imports/model-update/id-rewriter/id-rewriter';

/** Dependency injection tokens. */
export namespace Tokens {
  export const FormatMapper = token<FormatMapper>('FormatMapper');
  export const Deserializer = token<Deserializer>('Deserializer');
  export const ModelUpdateEvaluator_Action = token<
    ModelUpdateEvaluator<Action>
  >('ModelUpdateEvaluator_Action');
  export const ModelUpdateEvaluator_Command = token<
    ModelUpdateEvaluator<Command>
  >('ModelUpdateEvaluator_Command');
  export const ModelUpdateEvaluator_Context = token<
    ModelUpdateEvaluator<Context>
  >('ModelUpdateEvaluator_Context');
  export const ModelUpdateEvaluator_Selector =
    token<SelectorModelUpdateEvaluator>('ModelUpdateEvaluator_Selector');
  export const ModelUpdateEvaluator_Spec = token<ModelUpdateEvaluator<SpecDTO>>(
    'ModelUpdateEvaluator_Spec'
  );
  export const ModelUpdateEvaluator_Variable = token<
    ModelUpdateEvaluator<VariableDTO>
  >('ModelUpdateEvaluator_Variable');
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
  export const ActionIdRewriter = token<IdRewriter<Action>>('ActionIdRewriter');
  export const ActionIdWithinCommandsRewriter = token<IdRewriter<Action>>(
    'ActionIdWithinCommandsRewriter'
  );
  export const CommandIdRewriter =
    token<IdRewriter<Command>>('CommandIdRewriter');
  export const ContextIdRewriter =
    token<IdRewriter<Context>>('ContextIdRewriter');
  export const SelectorIdRewriter =
    token<IdRewriter<SelectorDTO>>('SelectorIdRewriter');
  export const SpecIdRewriter = token<IdRewriter<SpecDTO>>('SpecIdRewriter');
  export const VariableIdRewriter =
    token<IdRewriter<VariableDTO>>('VariableIdRewriter');
  export const VariableIdWithinActionsRewriter = token<IdRewriter<VariableDTO>>(
    'VariableIdWithinActionsRewriter'
  );
}
