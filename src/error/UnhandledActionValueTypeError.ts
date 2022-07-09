import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledActionValueTypeError extends SleightError {
  constructor(actionValueType: string) {
    super(
      ErrorCode.UNHANDLED_ACTION_VALUE_TYPE,
      'Unhandled action value type: ' + actionValueType
    );
  }
}
