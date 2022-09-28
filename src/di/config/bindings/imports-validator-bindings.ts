import { Container, injected } from 'brandi';
import { DefaultImportsValidator } from '../../../data/imports/imports-validator';
import { Tokens } from '../brandi-tokens';

export const bindImportsValidator = (container: Container): void => {
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
};
