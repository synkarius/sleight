import { Container, injected } from 'brandi';
import { ActionMappingCleaner } from '../../../core/cleaners/action-cleaner';
import { CommandMappingCleaner } from '../../../core/cleaners/command-cleaner';
import { ContextMappingCleaner } from '../../../core/cleaners/context-cleaner';
import { DefaultFnCleaner } from '../../../core/cleaners/fn-cleaner';
import { SelectorMappingCleaner } from '../../../core/cleaners/selector-cleaner';
import { DefaultSpecCleaner } from '../../../core/cleaners/spec-cleaner';
import { DefaultVariableCleaner } from '../../../core/cleaners/variable-cleaner';
import { Tokens } from '../brandi-tokens';

export const bindCleaners = (container: Container): void => {
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
  // fn cleaner
  container
    .bind(Tokens.Cleaner_Fn)
    .toInstance(DefaultFnCleaner)
    .inSingletonScope();
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
};
