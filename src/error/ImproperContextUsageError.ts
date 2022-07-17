import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class ImproperContextUsageError extends SleightError {
  constructor() {
    super(
      ErrorCode.IMPROPER_CONTEXT_USAGE,
      ErrorCode.IMPROPER_CONTEXT_USAGE.toString()
    );
  }
}
