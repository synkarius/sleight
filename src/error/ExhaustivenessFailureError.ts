import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

/**
 * ExhaustivenessFailureError is used to cause compile time errors
 * in switch statements with missing case statements.
 */
export class ExhaustivenessFailureError extends SleightError {
  constructor(n: never) {
    super(ErrorCode.EXHAUSTIVENESS_FAIURE, 'this line should never be reached');
  }
}
