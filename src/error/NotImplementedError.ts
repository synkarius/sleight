import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class NotImplementedError extends SleightError {
  constructor() {
    super(ErrorCode.NOT_IMPLEMENTED, ErrorCode.NOT_IMPLEMENTED.toString());
  }
}
