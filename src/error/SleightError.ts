import { ErrorCode } from './error-codes';

export class SleightError extends Error {
  errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;

    // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, SleightError.prototype);
  }
}
