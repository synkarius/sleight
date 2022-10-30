import { SleightDataInternalFormat } from '../../data-formats';
import { CompositeValidationResult } from '../composite-validation-result';

export type TotalDataCompositeValidator = {
  validateSleightData: (
    data: SleightDataInternalFormat
  ) => CompositeValidationResult;
};
