import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class MissingGuardError extends SleightError {
  constructor(location: string) {
    super(ErrorCode.MISSING_GUARD, 'Missing type guard: ' + location);
  }
}
