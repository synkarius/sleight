import { Container, injected } from 'brandi';
import { DefaultImportsCleaner } from '../../../data/imports/imports-cleaner';
import { Tokens } from '../brandi-tokens';

export const bindImportsCleaner = (container: Container): void => {
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
};
