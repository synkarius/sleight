import { SleightDataInternalFormat } from '../../data/data-formats';
import { ValidationResult } from '../validation-result';

export type ValidateAllFunction = (
  data: SleightDataInternalFormat
) => ValidationResult;
