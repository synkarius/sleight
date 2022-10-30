import { SleightDataInternalFormat } from '../../data-formats';
import { CompositeValidationResult } from '../composite-validation-result';
import { Validateable } from '../validateable';

export type SingleItemCompositeValidator<L extends Validateable> = {
  validateSingle: (
    validateable: L,
    data: SleightDataInternalFormat
  ) => CompositeValidationResult;
};
