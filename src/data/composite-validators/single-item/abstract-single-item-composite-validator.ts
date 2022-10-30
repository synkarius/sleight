import { not } from '../../../core/common/common-functions';
import {
  FieldValidator,
  isDeletionValidator,
} from '../../../validation/field-validator';
import { SleightDataInternalFormat } from '../../data-formats';
import { CompositeValidationResult } from '../composite-validation-result';
import {
  aggregateInvalidResults,
  convertResult,
} from '../composite-validation-utils';
import { Validateable } from '../validateable';
import { SingleItemCompositeValidator } from './single-item-composite-validator';

export abstract class AbstractSingleItemCompositeValidator<
  L extends Validateable
> implements SingleItemCompositeValidator<L>
{
  abstract getValidators(): FieldValidator<L>[];

  validateSingle(
    item: L,
    data: SleightDataInternalFormat
  ): CompositeValidationResult {
    const results = this.getValidators()
      .filter((v) => v.isApplicable(item))
      .filter(not(isDeletionValidator))
      .map((v) => convertResult(item, v.validate(item, data)));
    return aggregateInvalidResults(results);
  }
}
