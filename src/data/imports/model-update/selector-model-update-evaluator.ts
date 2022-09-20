import { SelectorDTO } from '../../model/selector/selector-dto';
import {
  ModelUpdateEvaluation,
  ModelUpdateEvaluationType,
} from './model-update-evaluator';

export type SelectorModelUpdateEvaluator = {
  evaluate: (
    candidate: SelectorDTO,
    baseDataElements: SelectorDTO[]
  ) => ModelUpdateEvaluation<SelectorDTO>;
};

/** Selectors don't have role keys; therefore, they can skip
 * the evaluation process. */
export const getSelectorModelUpdateEvaluator =
  (): SelectorModelUpdateEvaluator => ({
    evaluate: (candidate, _baseDataElements) => ({
      evaluationType: ModelUpdateEvaluationType.ID_REWRITE,
      candidate,
    }),
  });
