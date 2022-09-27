import { SelectorDTO } from '../../../model/selector/selector-dto';
import { ElementEvaluation } from './element-evaluation';
import { ElementEvaluationType } from './element-evaluation-type';
import { ElementEvaluator } from './element-evaluator';

/** Selectors don't have role keys; therefore, they can skip
 * the evaluation process. */
export class DefaultSelectorEvaluator implements ElementEvaluator<SelectorDTO> {
  evaluate(
    candidate: SelectorDTO,
    _baseDataElements: unknown
  ): ElementEvaluation<SelectorDTO> {
    return {
      evaluationType: ElementEvaluationType.ID_REWRITE,
      candidate,
    };
  }
}
