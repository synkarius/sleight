import { ActionReducerActionType } from '../features/model/action/action-editing-context';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledActionValueOperationError extends SleightError {
  constructor(operation: ActionReducerActionType) {
    super(
      ErrorCode.UNHANDLED_ACTION_VALUE_OPERATION,
      ActionReducerActionType[operation]
    );
  }
}
