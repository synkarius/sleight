import { Container } from 'brandi';
import {
  ActionEvaluator,
  CommandEvaluator,
  ContextEvaluator,
  FnEvaluator,
  SpecEvaluator,
  VariableEvaluator,
} from '../../../data/imports/model-update/evaluators/import-process-evaluators';
import { DefaultSelectorEvaluator } from '../../../data/imports/model-update/evaluators/selector-model-update-evaluator';
import { Tokens } from '../brandi-tokens';

export const bindImportProcessEvaluators = (container: Container): void => {
  container
    .bind(Tokens.ActionEvaluator)
    .toInstance(ActionEvaluator)
    .inSingletonScope();
  container
    .bind(Tokens.CommandEvaluator)
    .toInstance(CommandEvaluator)
    .inSingletonScope();
  container
    .bind(Tokens.ContextEvaluator)
    .toInstance(ContextEvaluator)
    .inSingletonScope();
  container.bind(Tokens.FnEvaluator).toInstance(FnEvaluator).inSingletonScope();
  container
    .bind(Tokens.SelectorEvaluator)
    .toInstance(DefaultSelectorEvaluator)
    .inSingletonScope();
  container
    .bind(Tokens.SpecEvaluator)
    .toInstance(SpecEvaluator)
    .inSingletonScope();
  container
    .bind(Tokens.VariableEvaluator)
    .toInstance(VariableEvaluator)
    .inSingletonScope();
};
