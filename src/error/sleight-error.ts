import { ErrorCode } from './error-codes';

/**
 * Base error class for Sleight errors. Create new error types which extend this rather than
 * using this class.
 */
export class SleightError extends Error {
  errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}
