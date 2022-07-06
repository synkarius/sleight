import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class CurrentActionNotFoundError extends SleightError {
  constructor() {
    super(ErrorCode.NOT_EDITING_AN_ACTION, 'Current action not found');
  }
}
