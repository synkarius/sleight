import { Container, injected } from 'brandi';
import { DefaultCommandListHelper } from '../../../core/command-list/command-list-helper';
import { Tokens } from '../brandi-tokens';

export const bindCommandCommandListHelper = (container: Container): void => {
  container
    .bind(Tokens.CommandListHelper)
    .toInstance(DefaultCommandListHelper)
    .inSingletonScope();
  injected(
    DefaultCommandListHelper,
    Tokens.DomainMapper_Action,
    Tokens.DomainMapper_Command,
    Tokens.DomainMapper_Context,
    Tokens.DomainMapper_Spec,
    Tokens.DomainMapper_Variable,
    Tokens.VariableExtractor
  );
};
