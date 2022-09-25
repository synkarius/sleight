import { isEmpty } from '../../../core/common/common-functions';
import { Action } from '../../model/action/action';
import { Command } from '../../model/command/command';
import { Context } from '../../model/context/context';
import { Lockable, RoleKeyed } from '../../model/domain';
import { SpecDTO } from '../../model/spec/spec-dto';
import { VariableDTO } from '../../model/variable/variable-dto';
import { ImportTargetable } from './import-targetable';
import {
  ModelUpdateEvaluator,
  ModelUpdateEvaluationType,
  ModelUpdateEvaluation,
} from './model-update-evaluator';

abstract class AbstractModelUpdateEvaluator<T extends ImportTargetable>
  implements ModelUpdateEvaluator<T>
{
  evaluate(candidate: T, baseDataElements: T[]): ModelUpdateEvaluation<T> {
    /* If the candidate has no role key or the candidate
     * matches no existing element: pass through and rewrite id. */
    if (
      isEmpty(candidate.roleKey) ||
      !baseDataElements.find((elem) => elem.roleKey === candidate.roleKey)
    ) {
      return {
        evaluationType: ModelUpdateEvaluationType.ID_REWRITE,
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
        evaluationType: ModelUpdateEvaluationType.DISCARD,
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
        evaluationType: ModelUpdateEvaluationType.OVERRIDE,
        overridden: target,
        candidate,
      };
    }

    /** One of the above conditions should match, but if they
     * somehow don't, return failure so that caller can report on
     * what happened.
     */
    return {
      evaluationType: ModelUpdateEvaluationType.EVALUATION_FAILURE,
      candidate,
    };
  }
}

export class ActionModelUpdateEvaluator extends AbstractModelUpdateEvaluator<Action> {}
export class CommandModelUpdateEvaluator extends AbstractModelUpdateEvaluator<Command> {}
export class ContextModelUpdateEvaluator extends AbstractModelUpdateEvaluator<Context> {}
export class SpecModelUpdateEvaluator extends AbstractModelUpdateEvaluator<SpecDTO> {}
export class VariableModelUpdateEvaluator extends AbstractModelUpdateEvaluator<VariableDTO> {}
