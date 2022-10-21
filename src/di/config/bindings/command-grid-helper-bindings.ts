import { Container, injected } from 'brandi';
import { DefaultCommandGridHelper } from '../../../core/command-grid/command-grid-helper';
import { Tokens } from '../brandi-tokens';

export const bindCommandGridHelper = (container: Container): void => {
  container
    .bind(Tokens.CommandGridHelper)
    .toInstance(DefaultCommandGridHelper)
    .inSingletonScope();
  injected(
    DefaultCommandGridHelper,
    Tokens.DomainMapper_Action,
    Tokens.DomainMapper_Command,
    Tokens.DomainMapper_Context,
    Tokens.DomainMapper_Spec,
    Tokens.DomainMapper_Variable,
    Tokens.VariableExtractor
  );
};
