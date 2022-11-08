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
import { ImportProcessEvaluator } from '../../data/imports/model-update/evaluators/import-process-evaluator';
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
import { token } from 'brandi';
import { FormatMapper } from '../../data/data-format-mapper';
import { Deserializer } from '../../data/imports/deserializer';
import { SpecItemDomainMapper } from '../../core/mappers/spec-item-domain-mapper';
import { TotalDataCompositeValidator } from '../../data/composite-validators/total/total-data-composite-validator';
import { VariableExtractor } from '../../validation/variable-extraction/variable-extractor';
import { IdedAndActionTyped } from '../../core/namers/action-default-namer';
import { Namer } from '../../core/namers/namer';
import { Ided } from '../../data/model/domain';
import { IdedAndContextTyped } from '../../core/namers/context-default-namer';
import { IdedAndVariableTyped } from '../../core/namers/variable-default-namer';
import { Cleaner } from '../../core/cleaners/cleaner';
import { ImportsCleaner } from '../../data/imports/imports-cleaner';
import { IdRewriter } from '../../data/imports/model-update/id-rewriter/id-rewriter';
import {
  ActionDomainMapperDelegateArray,
  ActionIdRewriterArray,
  ContextIdRewriterArray,
  DragonflyActionPrinterDelegateArray,
  FnIdRewriterArray,
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
import { DragonflyBringAppPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-bring-app-action-printer-delegate';
import { DragonflyPausePrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-pause-action-printer-delegate';
import { DragonflyActionValueResolver } from '../../data/exports/dragonfly/element-printers/action-value/dragonfly-action-value-resolver';
import { DragonflyCallFunctionPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-call-function-action-printer-delegate';
import { DragonflyMimicPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-mimic-action-printer-delegate';
import { DragonflyMousePrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-mouse-action-printer-delegate';
import { DragonflySendKeyPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-send-key-action-printer-delegate';
import { DragonflySendTextPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-send-text-action-printer-delegate';
import { DragonflyWaitForWindowPrinter } from '../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-wait-for-window-action-printer-delegate';
import { ActionValueUpdaterDelegate } from '../../core/reducers/action-value/action-value-reducer-updaters/action-value-updater-delegate';
import { ActionValueUpdater } from '../../core/reducers/action-value/action-value-reducer-updaters/action-value-updater';
import { Fn, FnParameter } from '../../data/model/fn/fn';
import {
  EnterEnumActionValue,
  EnterNumberActionValue,
  EnterTextActionValue,
  VariableEnumActionValue,
  VariableRangeActionValue,
  VariableTextActionValue,
} from '../../data/model/action/action-value';
import { MultiMethodActionValueMapper } from '../../core/mappers/action-mapper-delegates/action-value-mapper/delegating-action-value-domain-mapper';
import { Modifiers } from '../../data/model/action/send-key/send-key';
import { CommandListHelper } from '../../core/command-list/command-list-helper';
import { SleightDataMerger } from '../../data/imports/data-merger';
import { ClickSpell, KeyPressSpell, TextSpell } from '../../data/wizard/spell';
import { SingleItemCompositeValidator } from '../../data/composite-validators/single-item/single-item-composite-validator';
import { SpellMapper } from '../../core/mappers/spell/spell-mapper';
import { Logger } from '../../core/common/basic-logger';
import { DragonflyRuleMapper } from '../../data/exports/dragonfly/dragonfly-rule-mapper';

/** Dependency injection tokens. */
export namespace Tokens {
  export const FormatMapper = token<FormatMapper>('FormatMapper');
  export const Deserializer = token<Deserializer>('Deserializer');
  export const ActionEvaluator =
    token<ImportProcessEvaluator<Action>>('ActionEvaluator');
  export const CommandEvaluator =
    token<ImportProcessEvaluator<Command>>('CommandEvaluator');
  export const ContextEvaluator =
    token<ImportProcessEvaluator<Context>>('ContextEvaluator');
  export const FnEvaluator = token<ImportProcessEvaluator<Fn>>('FnEvaluator');
  export const SelectorEvaluator =
    token<ImportProcessEvaluator<SelectorDTO>>('SelectorEvaluator');
  export const SpecEvaluator =
    token<ImportProcessEvaluator<SpecDTO>>('SpecEvaluator');
  export const VariableEvaluator =
    token<ImportProcessEvaluator<VariableDTO>>('VariableEvaluator');
  export const SleightDataEvaluator = token<SleightDataEvaluator>(
    'SleightDataEvaluator'
  );
  export const RoleKeyedDataUpdater = token<RoleKeyedDataUpdater>(
    'RoleKeyedDataUpdater'
  );
  export const ImportDataMerger = token<ImportDataMerger>('ImportDataMerger');
  export const SleightDataMerger =
    token<SleightDataMerger>('SleightDataMerger');
  export const JsonExporter = token<Exporter>('JsonExporter');
  export const DragonflyExporter = token<Exporter>('DragonflyExporter');
  export const Validators_Action =
    token<FieldValidator<Action>[]>('Validators_Action');
  export const Validators_Command =
    token<FieldValidator<Command>[]>('Validators_Command');
  export const Validators_Context =
    token<FieldValidator<Context>[]>('Validators_Context');
  export const Validators_Fn = token<FieldValidator<Fn>[]>('Validators_Fn');
  export const Validators_Spec =
    token<FieldValidator<Spec>[]>('Validators_Spec');
  export const Validators_Variable = token<FieldValidator<Variable>[]>(
    'Validators_Variable'
  );
  export const ActionCompositeValidator = token<
    SingleItemCompositeValidator<Action>
  >('ActionCompositeValidator');
  export const CommandCompositeValidator = token<
    SingleItemCompositeValidator<Command>
  >('CommandCompositeValidator');
  export const ContextCompositeValidator = token<
    SingleItemCompositeValidator<Context>
  >('ContextCompositeValidator');
  export const FnCompositeValidator = token<SingleItemCompositeValidator<Fn>>(
    'FnCompositeValidator'
  );
  export const SpecCompositeValidator = token<
    SingleItemCompositeValidator<Spec>
  >('SpecCompositeValidator');
  export const VariableCompositeValidator = token<
    SingleItemCompositeValidator<Variable>
  >('VariableCompositeValidator');
  // mapper dependencies
  export const BringAppActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>('BringAppActionDomainMapperDelegate');
  export const CallFunctionActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>('CallFunctionActionDomainMapperDelegate');
  export const MimicActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>('MimicActionDomainMapperDelegate');
  export const MouseActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>('MouseActionDomainMapperDelegate');
  export const PauseActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>('PauseActionDomainMapperDelegate');
  export const SendKeyActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>('SendKeyActionDomainMapperDelegate');
  export const SendTextActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>('SendTextActionDomainMapperDelegate');
  export const WaitForWindowActionDomainMapperDelegate =
    token<ActionDomainMapperDelegate>(
      'WaitForWindowActionDomainMapperDelegate'
    );

  export const ActionDomainMapperDelegateArray =
    token<ActionDomainMapperDelegateArray>('ActionDomainMapperDelegateArray');
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
  export const DomainMapper_FnParameter = token<
    DomainMapper<FnParameter, FnParameter>
  >('DomainMapper_FnParameter');
  export const DomainMapper_Fn = token<DomainMapper<Fn, Fn>>('DomainMapper_Fn');
  export const DomainMapper_Selector = token<
    DomainMapper<Selector, SelectorDTO>
  >('DomainMapper_Selector');
  export const DomainMapper_Spec = token<SpecDomainMapper>('DomainMapper_Spec');
  export const DomainMapper_Variable = token<VariableDomainMapper>(
    'DomainMapper_Variable'
  );
  export const DomainMapper_ActionValue_Enter_Text = token<
    DomainMapper<EnterTextActionValue, EnterTextActionValue>
  >('DomainMapper_ActionValue_Enter_Text');
  export const DomainMapper_ActionValue_Enter_Number = token<
    DomainMapper<EnterNumberActionValue, EnterNumberActionValue>
  >('DomainMapper_ActionValue_Enter_Number');
  export const DomainMapper_ActionValue_Enter_Enum = token<
    DomainMapper<EnterEnumActionValue, EnterEnumActionValue>
  >('DomainMapper_ActionValue_Enter_Enum');
  export const DomainMapper_ActionValue_Variable_Text = token<
    DomainMapper<VariableTextActionValue, VariableTextActionValue>
  >('DomainMapper_ActionValue_Variable_Text');
  export const DomainMapper_ActionValue_Variable_Number = token<
    DomainMapper<VariableRangeActionValue, VariableRangeActionValue>
  >('DomainMapper_ActionValue_Variable_Number');
  export const DomainMapper_ActionValue_Variable_Enum = token<
    DomainMapper<VariableEnumActionValue, VariableEnumActionValue>
  >('DomainMapper_ActionValue_Variable_Enum');
  export const DomainMapper_ActionValue = token<MultiMethodActionValueMapper>(
    'DomainMapper_ActionValue'
  );
  export const DomainMapper_SendKeyModifiers = token<
    DomainMapper<Modifiers, Modifiers>
  >('DomainMapper_SendKeyModifiers');
  //
  export const TotalDataCompositeValidator = token<TotalDataCompositeValidator>(
    'TotalDataCompositeValidator'
  );
  export const VariableExtractorDelegates = token<VariableExtractorDelegate[]>(
    'VariableExtractorDelegates'
  );
  export const VariableExtractor =
    token<VariableExtractor>('VariableExtractor');
  // namers
  export const DefaultNamer_Action = token<Namer<IdedAndActionTyped>>(
    'DefaultNamer_Action'
  );
  export const DefaultNamer_Command = token<Namer<Ided>>(
    'DefaultNamer_Command'
  );
  export const DefaultNamer_Context = token<Namer<IdedAndContextTyped>>(
    'DefaultNamer_Context'
  );
  export const DefaultNamer_Spec = token<Namer<Ided>>('DefaultNamer_Spec');
  export const DefaultNamer_Variable = token<Namer<IdedAndVariableTyped>>(
    'DefaultNamer_Variable'
  );
  export const WizardNamer_Action = token<Namer<Action>>('WizardNamer_Action');
  export const WizardNamer_Command = token<Namer<Command>>(
    'WizardNamer_Command'
  );
  export const WizardNamer_Spec = token<Namer<Spec>>('WizardNamer_Spec');
  // cleaners
  export const Cleaner_Action = token<Cleaner<Action>>('Cleaner_Action');
  export const Cleaner_Command = token<Cleaner<Command>>('Cleaner_Command');
  export const Cleaner_Context = token<Cleaner<Context>>('Cleaner_Context');
  export const Cleaner_Fn = token<Cleaner<Fn>>('Cleaner_Fn');
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
  export const FnIdRewriter = token<IdRewriter<Fn>>('FnIdRewriter');
  export const FnIdWithinActionsRewriter = token<IdRewriter<Fn>>(
    'FnIdWithinActionsRewriter'
  );
  export const FnIdRewriterArray =
    token<FnIdRewriterArray>('FnIdRewriterArray');
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
  export const CommandListHelper =
    token<CommandListHelper>('CommandListHelper');
  //
  export const KeyPressSpellMapper = token<SpellMapper<KeyPressSpell>>(
    'KeyPressSpellMapper'
  );
  export const TextSpellMapper =
    token<SpellMapper<TextSpell>>('TextSpellMapper');
  export const ClickSpellMapper =
    token<SpellMapper<ClickSpell>>('ClickSpellMapper');
  export const KeyPressSpellSpecValidator = token<
    FieldValidator<KeyPressSpell>
  >('KeyPressSpellSpecValidator');
  export const KeyPressSpellActionValidator = token<
    FieldValidator<KeyPressSpell>
  >('KeyPressSpellActionValidator');
  export const KeyPressSpellCommandValidator = token<
    FieldValidator<KeyPressSpell>
  >('KeyPressSpellCommandValidator');
  export const TextSpellSpecValidator = token<FieldValidator<TextSpell>>(
    'TextSpellSpecValidator'
  );
  export const TextSpellActionValidator = token<FieldValidator<TextSpell>>(
    'TextSpellActionValidator'
  );
  export const TextSpellCommandValidator = token<FieldValidator<TextSpell>>(
    'TextSpellCommandValidator'
  );
  export const ClickSpellSpecValidator = token<FieldValidator<ClickSpell>>(
    'ClickSpellSpecValidator'
  );
  export const ClickSpellActionValidator = token<FieldValidator<ClickSpell>>(
    'ClickSpellActionValidator'
  );
  export const ClickSpellCommandValidator = token<FieldValidator<ClickSpell>>(
    'ClickSpellCommandValidator'
  );
  export const Logger = token<Logger>('Logger');
  export const DragonflyRuleMapper = token<DragonflyRuleMapper>(
    'DragonflyRuleMapper'
  );
}
