import { Container } from 'brandi';
import { DefaultDragonflyBuiltinFnsProvider } from '../../../data/exports/dragonfly/builtin-fns/builtin-fns-supplier';
import { Tokens } from '../brandi-tokens';

export const bindBuiltinFnsProvider = (container: Container): void => {
  container
    .bind(Tokens.DragonflyBuiltinFnsProvider)
    .toInstance(DefaultDragonflyBuiltinFnsProvider)
    .inSingletonScope();
};
