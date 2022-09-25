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
export class DefaultSelectorModelUpdateEvaluator
  implements SelectorModelUpdateEvaluator
{
  evaluate(
    candidate: SelectorDTO,
    _baseDataElements: unknown
  ): ModelUpdateEvaluation<SelectorDTO> {
    return {
      evaluationType: ModelUpdateEvaluationType.ID_REWRITE,
      candidate,
    };
  }
}
