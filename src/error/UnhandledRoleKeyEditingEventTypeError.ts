import { RoleKeyActionType } from '../features/model/role-key/role-key-editing-context';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledRoleKeyEditingEventTypeError extends SleightError {
  constructor(type: RoleKeyActionType) {
    super(
      ErrorCode.UNHANDLED_ROLE_KEY_EDITING_EVENT_TYPE,
      RoleKeyActionType[type]
    );
  }
}
