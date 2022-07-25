import { ContextReducerActionType } from '../features/model/context/context-editing-context';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledContextEditingEventTypeError extends SleightError {
  constructor(type: ContextReducerActionType) {
    super(
      ErrorCode.UNHANDLED_CONTEXT_EDITING_EVENT_TYPE,
      ContextReducerActionType[type]
    );
  }
}
