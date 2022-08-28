import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class MissingDelegateError extends SleightError {
  constructor(name: string) {
    super(ErrorCode.MISSING_DELEGATE, 'Missing delegate: ' + name);
  }
}
