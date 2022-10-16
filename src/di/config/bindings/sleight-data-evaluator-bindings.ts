import { Container, injected } from 'brandi';
import { DefaultSleightDataEvaluator } from '../../../data/imports/model-update/evaluators/sleight-data-evaluator';
import { Tokens } from '../brandi-tokens';

export const bindSleightDataEvaluator = (container: Container): void => {
  container
    .bind(Tokens.SleightDataEvaluator)
    .toInstance(DefaultSleightDataEvaluator)
    .inSingletonScope();
  injected(
    DefaultSleightDataEvaluator,
    Tokens.ActionEvaluator,
    Tokens.CommandEvaluator,
    Tokens.ContextEvaluator,
    Tokens.FnEvaluator,
    Tokens.SelectorEvaluator,
    Tokens.SpecEvaluator,
    Tokens.VariableEvaluator
  );
};
