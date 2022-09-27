import { isEmpty } from '../../../../core/common/common-functions';
import { ModelUpdateEvaluationFailureError } from '../../../../error/model-update-evaluation-failure-error';
import { Action } from '../../../model/action/action';
import { Command } from '../../../model/command/command';
import { Context } from '../../../model/context/context';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { ImportTargetable } from '../import-targetable';
import { ElementEvaluation } from './element-evaluation';
import { ElementEvaluationType } from './element-evaluation-type';
import { ElementEvaluator } from './element-evaluator';

abstract class AbstractElementEvaluator<T extends ImportTargetable>
  implements ElementEvaluator<T>
{
  evaluate(candidate: T, baseDataElements: T[]): ElementEvaluation<T> {
    /* If the candidate has no role key or the candidate
     * matches no existing element: pass through and rewrite id. */
    if (
      isEmpty(candidate.roleKey) ||
      !baseDataElements.find((elem) => elem.roleKey === candidate.roleKey)
    ) {
      return {
        evaluationType: ElementEvaluationType.ID_REWRITE,
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
        evaluationType: ElementEvaluationType.DISCARD,
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
        evaluationType: ElementEvaluationType.OVERRIDE,
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

export class ActionEvaluator extends AbstractElementEvaluator<Action> {}
export class CommandEvaluator extends AbstractElementEvaluator<Command> {}
export class ContextEvaluator extends AbstractElementEvaluator<Context> {}
// selector evaluator doesn't extend this interface
export class SpecEvaluator extends AbstractElementEvaluator<SpecDTO> {}
export class VariableEvaluator extends AbstractElementEvaluator<VariableDTO> {}
