import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledVariableTypeError extends SleightError {
    constructor(variableType:string) {
        super(ErrorCode.UNHANDLED_VARIABLE_TYPE, 
            "Unhandled variable type: " + variableType);
    }
}