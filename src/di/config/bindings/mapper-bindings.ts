import { Container, injected } from 'brandi';
import { DelegatingActionDomainMapper } from '../../../core/mappers/action-domain-mapper';
import { DelegatingActionValueDomainMapper } from '../../../core/mappers/action-mapper-delegates/action-value-mapper/delegating-action-value-domain-mapper';
import { EnterEnumActionValueDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/action-value-mapper/enter-enum-action-value-domain-mapper-delegate';
import { EnterNumberActionValueDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/action-value-mapper/enter-numeric-action-value-domain-mapper-delegate';
import { EnterTextActionValueDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/action-value-mapper/enter-text-action-value-domain-mapper-delegate';
import { VariableEnumActionValueDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/action-value-mapper/variable-enum-action-value-domain-mapper-delegate';
import { VariableNumericActionValueDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/action-value-mapper/variable-numeric-action-value-domain-mapper-delegate';
import { VariableTextActionValueDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/action-value-mapper/variable-text-action-value-domain-mapper-delegate';
import { BringAppActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/bring-app-action-domain-mapper-delegate';
import { CallFunctionActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/call-function-action-domain-mapper-delegate';
import { MimicActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/mimic-action-domain-mapper-delegate';
import { MouseActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/mouse-action-domain-mapper-delegate';
import { PauseActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/pause-action-domain-mapper-delegate';
import { SendKeyActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/send-key-action-domain-mapper-delegate';
import { SendKeyModifiersDomainMapper } from '../../../core/mappers/action-mapper-delegates/send-key-modifiers-domain-mapper';
import { SendTextActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/send-text-action-domain-mapper-delegate';
import { WaitForWindowActionDomainMapperDelegate } from '../../../core/mappers/action-mapper-delegates/wait-for-window-action-domain-mapper-delegate';
import {
  DefaultChoiceItemDomainMapper,
  DefaultChoiceVariableDomainMapper,
} from '../../../core/mappers/choice-variable-domain-mapper';
import { DefaultCommandDomainMapper } from '../../../core/mappers/command-domain-mapper';
import { DefaultContextDomainMapper } from '../../../core/mappers/context-domain-mapper';
import { DefaultFnMapper } from '../../../core/mappers/fn-mapper';
import { DefaultFnParameterMapper } from '../../../core/mappers/fn-parameter-mapper';
import { DefaultRangeVariableDomainMapper } from '../../../core/mappers/range-variable-domain-mapper';
import { DefaultSelectorDomainMapper } from '../../../core/mappers/selector-domain-mapper';
import { DefaultSelectorItemDomainMapper } from '../../../core/mappers/selector-item-domain-mapper';
import { DefaultSpecDomainMapper } from '../../../core/mappers/spec-domain-mapper';
import { DefaultSpecItemDomainMapper } from '../../../core/mappers/spec-item-domain-mapper';
import { DefaultTextVariableDomainMapper } from '../../../core/mappers/text-variable-domain-mapper-delegate';
import { DefaultVariableDomainMapper } from '../../../core/mappers/variable-domain-mapper';
import { ActionDomainMapperDelegateArray } from '../../di-collection-types';
import { Tokens } from '../brandi-tokens';

export const bindMappers = (container: Container): void => {
  // action value mappers
  bindActionValueMappers(container);
  // action mapper delegates
  bindActionMapperDelegates(container);
  // action domain mapper
  container
    .bind(Tokens.DomainMapper_Action)
    .toInstance(DelegatingActionDomainMapper)
    .inSingletonScope();
  injected(
    DelegatingActionDomainMapper,
    Tokens.ActionDomainMapperDelegateArray
  );
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
  // fn param mapper
  container
    .bind(Tokens.DomainMapper_FnParameter)
    .toInstance(DefaultFnParameterMapper)
    .inSingletonScope();
  // fn domain mapper
  container
    .bind(Tokens.DomainMapper_Fn)
    .toInstance(DefaultFnMapper)
    .inSingletonScope();
  injected(DefaultFnMapper, Tokens.DomainMapper_FnParameter);
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
};

const bindActionMapperDelegates = (container: Container): void => {
  container
    .bind(Tokens.DomainMapper_SendKeyModifiers)
    .toInstance(SendKeyModifiersDomainMapper)
    .inSingletonScope();
  container
    .bind(Tokens.BringAppActionDomainMapperDelegate)
    .toInstance(BringAppActionDomainMapperDelegate)
    .inSingletonScope();
  injected(BringAppActionDomainMapperDelegate, Tokens.DomainMapper_ActionValue);
  container
    .bind(Tokens.CallFunctionActionDomainMapperDelegate)
    .toInstance(CallFunctionActionDomainMapperDelegate)
    .inSingletonScope();
  injected(
    CallFunctionActionDomainMapperDelegate,
    Tokens.DomainMapper_ActionValue
  );
  container
    .bind(Tokens.MimicActionDomainMapperDelegate)
    .toInstance(MimicActionDomainMapperDelegate)
    .inSingletonScope();
  injected(MimicActionDomainMapperDelegate, Tokens.DomainMapper_ActionValue);
  container
    .bind(Tokens.MouseActionDomainMapperDelegate)
    .toInstance(MouseActionDomainMapperDelegate)
    .inSingletonScope();
  injected(MouseActionDomainMapperDelegate, Tokens.DomainMapper_ActionValue);
  container
    .bind(Tokens.PauseActionDomainMapperDelegate)
    .toInstance(PauseActionDomainMapperDelegate)
    .inSingletonScope();
  injected(PauseActionDomainMapperDelegate, Tokens.DomainMapper_ActionValue);
  container
    .bind(Tokens.SendKeyActionDomainMapperDelegate)
    .toInstance(SendKeyActionDomainMapperDelegate)
    .inSingletonScope();
  injected(
    SendKeyActionDomainMapperDelegate,
    Tokens.DomainMapper_ActionValue,
    Tokens.DomainMapper_SendKeyModifiers
  );
  container
    .bind(Tokens.SendTextActionDomainMapperDelegate)
    .toInstance(SendTextActionDomainMapperDelegate)
    .inSingletonScope();
  injected(SendTextActionDomainMapperDelegate, Tokens.DomainMapper_ActionValue);
  container
    .bind(Tokens.WaitForWindowActionDomainMapperDelegate)
    .toInstance(WaitForWindowActionDomainMapperDelegate)
    .inSingletonScope();
  injected(
    WaitForWindowActionDomainMapperDelegate,
    Tokens.DomainMapper_ActionValue
  );
  container
    .bind(Tokens.ActionDomainMapperDelegateArray)
    .toInstance(ActionDomainMapperDelegateArray)
    .inSingletonScope();
  injected(
    ActionDomainMapperDelegateArray,
    Tokens.BringAppActionDomainMapperDelegate,
    Tokens.CallFunctionActionDomainMapperDelegate,
    Tokens.MimicActionDomainMapperDelegate,
    Tokens.MouseActionDomainMapperDelegate,
    Tokens.PauseActionDomainMapperDelegate,
    Tokens.SendKeyActionDomainMapperDelegate,
    Tokens.SendTextActionDomainMapperDelegate,
    Tokens.WaitForWindowActionDomainMapperDelegate
  );
};

const bindActionValueMappers = (container: Container): void => {
  container
    .bind(Tokens.DomainMapper_ActionValue_Enter_Text)
    .toInstance(EnterTextActionValueDomainMapperDelegate)
    .inSingletonScope();
  container
    .bind(Tokens.DomainMapper_ActionValue_Enter_Number)
    .toInstance(EnterNumberActionValueDomainMapperDelegate)
    .inSingletonScope();
  container
    .bind(Tokens.DomainMapper_ActionValue_Enter_Enum)
    .toInstance(EnterEnumActionValueDomainMapperDelegate)
    .inSingletonScope();
  container
    .bind(Tokens.DomainMapper_ActionValue_Variable_Text)
    .toInstance(VariableTextActionValueDomainMapperDelegate)
    .inSingletonScope();
  container
    .bind(Tokens.DomainMapper_ActionValue_Variable_Number)
    .toInstance(VariableNumericActionValueDomainMapperDelegate)
    .inSingletonScope();
  container
    .bind(Tokens.DomainMapper_ActionValue_Variable_Enum)
    .toInstance(VariableEnumActionValueDomainMapperDelegate)
    .inSingletonScope();
  container
    .bind(Tokens.DomainMapper_ActionValue)
    .toInstance(DelegatingActionValueDomainMapper)
    .inSingletonScope();
  injected(
    DelegatingActionValueDomainMapper,
    Tokens.DomainMapper_ActionValue_Enter_Text,
    Tokens.DomainMapper_ActionValue_Enter_Number,
    Tokens.DomainMapper_ActionValue_Enter_Enum,
    Tokens.DomainMapper_ActionValue_Variable_Text,
    Tokens.DomainMapper_ActionValue_Variable_Number,
    Tokens.DomainMapper_ActionValue_Variable_Enum
  );
};
