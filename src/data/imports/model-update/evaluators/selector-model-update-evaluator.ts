import { SelectorDTO } from '../../../model/selector/selector-dto';
import { ImportProcessEvaluation } from './import-process-evaluation';
import { ImportProcessEvaluationType } from './import-process-evaluation-type';
import { ImportProcessEvaluator } from './import-process-evaluator';

/** Selectors don't have role keys; therefore, they can skip
 * the evaluation process. */
export class DefaultSelectorEvaluator
  implements ImportProcessEvaluator<SelectorDTO>
{
  evaluate(
    candidate: SelectorDTO,
    _baseDataElements: unknown
  ): ImportProcessEvaluation<SelectorDTO> {
    return {
      evaluationType: ImportProcessEvaluationType.ID_REWRITE,
      candidate,
    };
  }
}
