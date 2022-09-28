import { Container, injected } from 'brandi';
import { DelegatingActionDomainMapper } from '../../../core/mappers/action-domain-mapper';
import { getActionDomainMapperDelegates } from '../../../core/mappers/action-mapper-delegates/action-domain-mapper-delegates';
import {
  DefaultChoiceItemDomainMapper,
  DefaultChoiceVariableDomainMapper,
} from '../../../core/mappers/choice-variable-domain-mapper';
import { DefaultCommandDomainMapper } from '../../../core/mappers/command-domain-mapper';
import { DefaultContextDomainMapper } from '../../../core/mappers/context-domain-mapper';
import { DefaultRangeVariableDomainMapper } from '../../../core/mappers/range-variable-domain-mapper';
import { DefaultSelectorDomainMapper } from '../../../core/mappers/selector-domain-mapper';
import { DefaultSelectorItemDomainMapper } from '../../../core/mappers/selector-item-domain-mapper';
import { DefaultSpecDomainMapper } from '../../../core/mappers/spec-domain-mapper';
import { DefaultSpecItemDomainMapper } from '../../../core/mappers/spec-item-domain-mapper';
import { DefaultTextVariableDomainMapper } from '../../../core/mappers/text-variable-domain-mapper-delegate';
import { DefaultVariableDomainMapper } from '../../../core/mappers/variable-domain-mapper';
import { Tokens } from '../brandi-tokens';

export const bindMappers = (container: Container): void => {
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
};
