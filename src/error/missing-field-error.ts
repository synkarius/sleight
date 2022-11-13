import { Field } from '../validation/validation-field';
import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class MissingFieldError extends SleightError {
  constructor(field: Field) {
    super(ErrorCode.MISSING_FIELD, 'Field missing: ' + Field[field]);
  }
}
