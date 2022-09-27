import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import {
  createSleightDataInternalFormat,
  SleightDataInternalFormat,
} from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { Command } from '../../../model/command/command';
import { Context } from '../../../model/context/context';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { ElementEvaluationType } from './element-evaluation-type';
import { ElementEvaluator } from './element-evaluator';
import { SleightDataEvaluation } from './sleight-data-evaluation';

export type SleightDataEvaluator = {
  evaluate: (
    base: SleightDataInternalFormat,
    deserialized: SleightDataInternalFormat
  ) => SleightDataEvaluation;
};

/** Split apart the rewrites and the overrides. Discard the discards. */
const addToEvaluation = <T>(
  base: Record<string, T>,
  deserialized: Record<string, T>,
  evaluator: ElementEvaluator<T>,
  sleightDataEvaluation: SleightDataEvaluation,
  resultSetter: (
    data: SleightDataInternalFormat,
    candidate: T
  ) => SleightDataInternalFormat
): SleightDataEvaluation => {
  const baseValues = Object.values(base);
  const evaluatedElements = Object.values(deserialized).map((element) =>
    evaluator.evaluate(element, baseValues)
  );
  for (const evaluatedElement of evaluatedElements) {
    const evaluationType = evaluatedElement.evaluationType;
    switch (evaluationType) {
      case ElementEvaluationType.DISCARD:
        continue;
      case ElementEvaluationType.ID_REWRITE:
        sleightDataEvaluation = {
          ...sleightDataEvaluation,
          rewriteIds: resultSetter(
            sleightDataEvaluation.rewriteIds,
            evaluatedElement.candidate
          ),
        };
        break;
      case ElementEvaluationType.OVERRIDE:
        sleightDataEvaluation = {
          ...sleightDataEvaluation,
          override: resultSetter(
            sleightDataEvaluation.override,
            evaluatedElement.candidate
          ),
        };
        break;
      default:
        throw new ExhaustivenessFailureError(evaluationType);
    }
  }
  return sleightDataEvaluation;
};

export class DefaultSleightDataEvaluator implements SleightDataEvaluator {
  constructor(
    private actionEvaluator: ElementEvaluator<Action>,
    private commandEvaluator: ElementEvaluator<Command>,
    private contextEvaluator: ElementEvaluator<Context>,
    private selectorEvaluator: ElementEvaluator<SelectorDTO>,
    private specEvaluator: ElementEvaluator<SpecDTO>,
    private variableEvaluator: ElementEvaluator<VariableDTO>
  ) {}

  evaluate(
    base: SleightDataInternalFormat,
    deserialized: SleightDataInternalFormat
  ): SleightDataEvaluation {
    let evaluation: SleightDataEvaluation = {
      rewriteIds: createSleightDataInternalFormat(),
      override: createSleightDataInternalFormat(),
    };

    evaluation = addToEvaluation(
      base.actions,
      deserialized.actions,
      this.actionEvaluator,
      evaluation,
      (data, action) => ({
        ...data,
        actions: { ...data.actions, [action.id]: action },
      })
    );
    evaluation = addToEvaluation(
      base.commands,
      deserialized.commands,
      this.commandEvaluator,
      evaluation,
      (data, command) => ({
        ...data,
        command: { ...data.commands, [command.id]: command },
      })
    );
    evaluation = addToEvaluation(
      base.contexts,
      deserialized.contexts,
      this.contextEvaluator,
      evaluation,
      (data, context) => ({
        ...data,
        contexts: { ...data.contexts, [context.id]: context },
      })
    );
    evaluation = addToEvaluation(
      base.selectors,
      deserialized.selectors,
      this.selectorEvaluator,
      evaluation,
      (data, selector) => ({
        ...data,
        selectors: { ...data.selectors, [selector.id]: selector },
      })
    );
    evaluation = addToEvaluation(
      base.specs,
      deserialized.specs,
      this.specEvaluator,
      evaluation,
      (data, spec) => ({
        ...data,
        specs: { ...data.specs, [spec.id]: spec },
      })
    );
    evaluation = addToEvaluation(
      base.variables,
      deserialized.variables,
      this.variableEvaluator,
      evaluation,
      (data, variable) => ({
        ...data,
        variables: { ...data.variables, [variable.id]: variable },
      })
    );

    return evaluation;
  }
}
