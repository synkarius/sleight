import { Container, injected } from 'brandi';
import { JsonDeserializer } from '../../../data/imports/deserializer';
import { Tokens } from '../brandi-tokens';

export const bindDeserializer = (container: Container): void => {
  container
    .bind(Tokens.Deserializer)
    .toInstance(JsonDeserializer)
    .inSingletonScope();
  injected(JsonDeserializer, Tokens.FormatMapper);
};
