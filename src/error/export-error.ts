import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class ExportError extends SleightError {
  constructor(message: string) {
    super(ErrorCode.EXPORT, message);
  }
}
