import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledSpecItemTypeError extends SleightError {
    constructor(specItemType:string) {
        super(ErrorCode.UNHANDLED_SPEC_ITEM_TYPE, 
            "Unhandled spec item type: " + specItemType);
    }
}