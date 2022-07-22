import { RoleKeyReducerActionType } from '../features/model/role-key/role-key-editing-context';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledRoleKeyEditingEventTypeError extends SleightError {
  constructor(type: RoleKeyReducerActionType) {
    super(
      ErrorCode.UNHANDLED_ROLE_KEY_EDITING_EVENT_TYPE,
      RoleKeyReducerActionType[type]
    );
  }
}
