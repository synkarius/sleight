import { Container } from 'brandi';
import { BasicLogger } from '../../../core/common/basic-logger';
import { Tokens } from '../brandi-tokens';

export const bindLogger = (container: Container): void => {
  container.bind(Tokens.Logger).toInstance(BasicLogger).inSingletonScope();
};
