import { ActionValueOperation } from '../features/model/action/action-value/action-value-operation';
import { ErrorCode } from './error-codes';
import { SleightError } from './SleightError';

export class UnhandledActionValueOperationError extends SleightError {
    constructor(operation:ActionValueOperation) {
        super(ErrorCode.UNHANDLED_ACTION_VALUE_OPERATION, 
            "Unhandled action value operation: " + operation);
    }
}