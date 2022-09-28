import { Container } from 'brandi';
import { DefaultFormatMapper } from '../../../data/data-format-mapper';
import { Tokens } from '../brandi-tokens';

export const bindFormatMapper = (container: Container): void => {
  container
    .bind(Tokens.FormatMapper)
    .toInstance(DefaultFormatMapper)
    .inSingletonScope();
};
