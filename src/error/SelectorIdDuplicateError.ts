import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class SelectorIdDuplicateError extends SleightError {
    constructor(selectorId:string) {
        super(ErrorCode.SELECTOR_ID_ALREADY_IN_USE, 
            "Selector id already in use: " + selectorId);
    }
}