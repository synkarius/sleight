import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import {
  createSleightDataInternalFormat,
  SleightDataInternalFormat,
} from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { Command } from '../../../model/command/command';
import { Context } from '../../../model/context/context';
import { Fn } from '../../../model/fn/fn';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { ImportProcessEvaluationType } from './import-process-evaluation-type';
import { ImportProcessEvaluator } from './import-process-evaluator';
import { SleightDataEvaluation } from './sleight-data-evaluation';

export type SleightDataEvaluator = {
  evaluate: (
    base: SleightDataInternalFormat,
    deserialized: SleightDataInternalFormat
  ) => SleightDataEvaluation;
};

export class DefaultSleightDataEvaluator implements SleightDataEvaluator {
  constructor(
    private actionEvaluator: ImportProcessEvaluator<Action>,
    private commandEvaluator: ImportProcessEvaluator<Command>,
    private contextEvaluator: ImportProcessEvaluator<Context>,
    private fnEvaluator: ImportProcessEvaluator<Fn>,
    private selectorEvaluator: ImportProcessEvaluator<SelectorDTO>,
    private specEvaluator: ImportProcessEvaluator<SpecDTO>,
    private variableEvaluator: ImportProcessEvaluator<VariableDTO>
  ) {}

  evaluate(
    base: SleightDataInternalFormat,
    deserialized: SleightDataInternalFormat
  ): SleightDataEvaluation {
    let evaluation: SleightDataEvaluation = {
      rewriteIds: createSleightDataInternalFormat(),
      override: createSleightDataInternalFormat(),
    };

    evaluation = this.addToEvaluation(
      base.actions,
      deserialized.actions,
      this.actionEvaluator,
      evaluation,
      (data, action) => ({
        ...data,
        actions: { ...data.actions, [action.id]: action },
      })
    );
    evaluation = this.addToEvaluation(
      base.commands,
      deserialized.commands,
      this.commandEvaluator,
      evaluation,
      (data, command) => ({
        ...data,
        commands: { ...data.commands, [command.id]: command },
      })
    );
    evaluation = this.addToEvaluation(
      base.contexts,
      deserialized.contexts,
      this.contextEvaluator,
      evaluation,
      (data, context) => ({
        ...data,
        contexts: { ...data.contexts, [context.id]: context },
      })
    );
    evaluation = this.addToEvaluation(
      base.fns,
      deserialized.fns,
      this.fnEvaluator,
      evaluation,
      (data, fn) => ({ ...data, fns: { ...data.fns, [fn.id]: fn } })
    );
    evaluation = this.addToEvaluation(
      base.selectors,
      deserialized.selectors,
      this.selectorEvaluator,
      evaluation,
      (data, selector) => ({
        ...data,
        selectors: { ...data.selectors, [selector.id]: selector },
      })
    );
    evaluation = this.addToEvaluation(
      base.specs,
      deserialized.specs,
      this.specEvaluator,
      evaluation,
      (data, spec) => ({
        ...data,
        specs: { ...data.specs, [spec.id]: spec },
      })
    );
    evaluation = this.addToEvaluation(
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

  /** Split apart the rewrites and the overrides. Discard the discards. */
  addToEvaluation<T>(
    base: Record<string, T>,
    deserialized: Record<string, T>,
    evaluator: ImportProcessEvaluator<T>,
    sleightDataEvaluation: SleightDataEvaluation,
    resultSetter: (
      data: SleightDataInternalFormat,
      candidate: T
    ) => SleightDataInternalFormat
  ): SleightDataEvaluation {
    const baseValues = Object.values(base);
    const evaluatedElements = Object.values(deserialized).map((element) =>
      evaluator.evaluate(element, baseValues)
    );
    for (const evaluatedElement of evaluatedElements) {
      const evaluationType = evaluatedElement.evaluationType;
      switch (evaluationType) {
        case ImportProcessEvaluationType.DISCARD:
          continue;
        case ImportProcessEvaluationType.ID_REWRITE:
          sleightDataEvaluation = {
            ...sleightDataEvaluation,
            rewriteIds: resultSetter(
              sleightDataEvaluation.rewriteIds,
              evaluatedElement.candidate
            ),
          };
          break;
        case ImportProcessEvaluationType.OVERRIDE:
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
  }
}
