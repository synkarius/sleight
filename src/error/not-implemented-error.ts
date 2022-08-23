import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class NotImplementedError extends SleightError {
  constructor(feature: string) {
    super(ErrorCode.NOT_IMPLEMENTED, 'feature not implemented yet: ' + feature);
  }
}
