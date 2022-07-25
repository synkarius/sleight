import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class NotImplementedError extends SleightError {
  constructor(feature: string) {
    super(ErrorCode.NOT_IMPLEMENTED, 'feature not implemented yet: ' + feature);
  }
}
