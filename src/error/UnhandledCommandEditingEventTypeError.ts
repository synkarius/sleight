import { CommandReducerActionType } from '../features/model/command/command-editing-context';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledCommandEditingEventTypeError extends SleightError {
  constructor(type: CommandReducerActionType) {
    super(
      ErrorCode.UNHANDLED_COMMAND_EDITING_EVENT_TYPE,
      CommandReducerActionType[type]
    );
  }
}
