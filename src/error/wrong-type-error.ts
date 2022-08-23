import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

/**
 * This error prevents data corruption due to dev mistakes.
 */
export class WrongTypeError extends SleightError {
  constructor(type: string) {
    super(ErrorCode.WRONG_TYPE_FAILURE, 'wrong type: ' + type);
  }
}
