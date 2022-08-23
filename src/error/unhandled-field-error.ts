import { Field } from '../validation/validation-field';
import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class UnhandledFieldError extends SleightError {
  constructor(field: Field) {
    super(ErrorCode.UNHANDLED_FIELD, 'Field not found: ' + Field[field]);
  }
}
