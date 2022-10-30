import {
  ValidationResult,
  ValidationResultType,
} from '../../validation/validation-result';
import { Ided } from '../model/domain';
import {
  CompositeValidationResult,
  CompositeValidationResultType,
  isInvalidCompositeValidationResult,
} from './composite-validation-result';

export const convertResult = <T extends Ided>(
  ided: T,
  result: ValidationResult
): CompositeValidationResult => {
  switch (result.type) {
    case ValidationResultType.VALID:
      return { status: CompositeValidationResultType.VALID };
    default:
      // lumping in validation failure here as an invalid type
      return {
        status: CompositeValidationResultType.INVALID,
        invalidated: [
          {
            id: ided.id,
            message: result.message,
          },
        ],
      };
  }
};

export const aggregateInvalidResults = (
  results: CompositeValidationResult[]
): CompositeValidationResult => {
  const invalidatedResults = results.filter(isInvalidCompositeValidationResult);
  return !!invalidatedResults.length
    ? {
        status: CompositeValidationResultType.INVALID,
        invalidated: invalidatedResults.flatMap((result) => result.invalidated),
      }
    : {
        status: CompositeValidationResultType.VALID,
      };
};
