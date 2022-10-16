import { isEmpty } from '../../../../core/common/common-functions';
import { ModelUpdateEvaluationFailureError } from '../../../../error/model-update-evaluation-failure-error';
import { Action } from '../../../model/action/action';
import { Command } from '../../../model/command/command';
import { Context } from '../../../model/context/context';
import { Fn } from '../../../model/fn/fn';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { ImportTargetable } from '../import-targetable';
import { ImportProcessEvaluation } from './import-process-evaluation';
import { ImportProcessEvaluationType } from './import-process-evaluation-type';
import { ImportProcessEvaluator } from './import-process-evaluator';

abstract class AbstractImportProcessEvaluator<T extends ImportTargetable>
  implements ImportProcessEvaluator<T>
{
  evaluate(candidate: T, baseDataElements: T[]): ImportProcessEvaluation<T> {
    /* If the candidate has no role key or the candidate
     * matches no existing element: pass through and rewrite id. */
    if (
      isEmpty(candidate.roleKey) ||
      !baseDataElements.find((elem) => elem.roleKey === candidate.roleKey)
    ) {
      return {
        evaluationType: ImportProcessEvaluationType.ID_REWRITE,
        candidate,
      };
    }

    /* If the candidate matches a locked existing element,
     * discard it. */
    if (
      baseDataElements.find(
        (elem) => elem.roleKey === candidate.roleKey && elem.locked
      )
    ) {
      return {
        evaluationType: ImportProcessEvaluationType.DISCARD,
        candidate,
      };
    }

    /* If the candidate matches an unlocked existing element,
     * override the existing element, keeping the original id. */
    const target = baseDataElements.find(
      (elem) => elem.roleKey === candidate.roleKey && !elem.locked
    );
    if (target) {
      return {
        evaluationType: ImportProcessEvaluationType.OVERRIDE,
        overridden: target,
        candidate,
      };
    }

    /** One of the above conditions should match, but if they
     * somehow don't, return failure so that caller can report on
     * what happened.
     */
    throw new ModelUpdateEvaluationFailureError(candidate);
  }
}

export class ActionEvaluator extends AbstractImportProcessEvaluator<Action> {}
export class CommandEvaluator extends AbstractImportProcessEvaluator<Command> {}
export class ContextEvaluator extends AbstractImportProcessEvaluator<Context> {}
export class FnEvaluator extends AbstractImportProcessEvaluator<Fn> {}
// selector evaluator doesn't extend this interface
export class SpecEvaluator extends AbstractImportProcessEvaluator<SpecDTO> {}
export class VariableEvaluator extends AbstractImportProcessEvaluator<VariableDTO> {}
