import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledSendKeyModeError extends SleightError {
  constructor(sendKeyMode: string) {
    super(
      ErrorCode.UNHANDLED_SEND_KEY_MODE,
      'Unhandled sendKey mode: ' + sendKeyMode
    );
  }
}
