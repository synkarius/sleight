import { isEmpty } from '../../../core/common/common-functions';
import { Lockable, RoleKeyed } from '../../model/domain';
import {
  ModelUpdateEvaluator,
  ModelUpdateEvaluationType,
} from './model-update-evaluator';

export const createModelUpdateEvaluator = <
  T extends RoleKeyed & Lockable
>(): ModelUpdateEvaluator<T> => ({
  evaluate: (candidate, baseDataElements) => {
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
  },
});
