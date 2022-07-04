import { SendKeyModifiers } from '../features/model/action/send-key/send-key-modifiers';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledSendKeyModifierTypeError extends SleightError {
    constructor(modifierType:SendKeyModifiers) {
        super(ErrorCode.UNHANDLED_SEND_KEY_MODIFIER_TYPE, 
            "Unhandled sendKey modifier type: " + modifierType);
    }
}