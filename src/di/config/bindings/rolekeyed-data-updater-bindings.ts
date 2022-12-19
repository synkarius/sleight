import { Container, injected } from 'brandi';
import { DefaultRoleKeyedDataUpdater } from '../../../data/imports/model-update/rolekeyed-data-updater';
import { Tokens } from '../brandi-tokens';

export const bindRoleKeyedDataUpdater = (container: Container): void => {
  container
    .bind(Tokens.RoleKeyedDataUpdater)
    .toInstance(DefaultRoleKeyedDataUpdater)
    .inSingletonScope();
  injected(
    DefaultRoleKeyedDataUpdater,
    Tokens.ActionIdRewriterArray,
    Tokens.CommandIdRewriterArray,
    Tokens.ContextIdRewriterArray,
    Tokens.FnIdRewriterArray,
    Tokens.SelectorIdRewriterArray,
    Tokens.SpecIdRewriterArray,
    Tokens.VariableIdRewriterArray
  );
};
