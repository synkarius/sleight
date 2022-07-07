import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledActionTypeError extends SleightError {
  constructor(actionType: string) {
    super(
      ErrorCode.UNHANDLED_ACTION_TYPE,
      'Unhandled action type: ' + actionType
    );
  }
}
