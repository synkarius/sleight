import { Container, injected } from 'brandi';
import { DefaultSleightDataIdsRewriter } from '../../../data/imports/model-update/id-rewriter/sleight-data-ids-rewriter';
import { Tokens } from '../brandi-tokens';

export const bindSleightDataIdsRewriter = (container: Container): void => {
  container
    .bind(Tokens.SleightDataIdsRewriter)
    .toInstance(DefaultSleightDataIdsRewriter)
    .inSingletonScope();
  injected(
    DefaultSleightDataIdsRewriter,
    Tokens.ActionIdRewriterArray,
    Tokens.CommandIdRewriterArray,
    Tokens.ContextIdRewriterArray,
    Tokens.FnIdRewriterArray,
    Tokens.SelectorIdRewriterArray,
    Tokens.SpecIdRewriterArray,
    Tokens.VariableIdRewriterArray
  );
};
