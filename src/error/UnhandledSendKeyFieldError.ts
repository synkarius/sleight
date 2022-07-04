import { SendKeyField } from '../features/model/action/send-key/send-key-payloads';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledSendKeyFieldError extends SleightError {
    constructor(field:SendKeyField) {
        super(ErrorCode.UNHANDLED_SEND_KEY_FIELD, "Unhandled sendKey field: " + field);
    }
}