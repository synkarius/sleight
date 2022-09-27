import { Ided } from '../data/model/domain';
import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class ModelUpdateEvaluationFailureError extends SleightError {
  constructor(ided: Ided) {
    super(
      ErrorCode.MODEL_UPDATE_EVALUATION_FAILURE,
      'Model update evaluation failure on id: ' + ided.id
    );
  }
}
