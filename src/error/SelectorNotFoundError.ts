import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class SelectorNotFoundError extends SleightError {
    constructor(selectorId:string) {
        super(ErrorCode.SELECTOR_ID_NOT_FOUND, "Selector id not found: " + selectorId);
    }
}