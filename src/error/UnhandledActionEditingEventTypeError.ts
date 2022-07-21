import { ActionReducerActionType } from '../features/model/action/action-editing-context';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledActionEditingEventTypeError extends SleightError {
  constructor(type: ActionReducerActionType) {
    super(
      ErrorCode.UNHANDLED_ACTION_EDITING_EVENT_TYPE,
      ActionReducerActionType[type]
    );
  }
}
