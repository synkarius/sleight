import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

/**
 * ExhaustivenessFailureError is used to cause compile time errors
 * in switch statements with missing case statements.
 */
export class ExhaustivenessFailureError extends SleightError {
  constructor(_n: never) {
    super(
      ErrorCode.EXHAUSTIVENESS_FAILURE,
      'this line should be unreachable -- this is a compile time error'
    );
  }
}
