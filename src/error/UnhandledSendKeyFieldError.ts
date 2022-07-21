import { Field } from '../validation/validation-field';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledSendKeyFieldError extends SleightError {
  constructor(field: Field) {
    super(ErrorCode.UNHANDLED_SEND_KEY_FIELD, Field[field]);
  }
}
