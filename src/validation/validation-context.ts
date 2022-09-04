import React from 'react';
import { Field } from './validation-field';
import {
  ErrorValidationResult,
  FailedValidationResult,
  ValidationResult,
  ValidationResultType,
} from './validation-result';

export type ErrorOrFailureValidationResult =
  | ErrorValidationResult
  | FailedValidationResult;
export const isErrorOrFailedValidationResult = (
  result: ValidationResult
): result is ErrorOrFailureValidationResult =>
  result.type !== ValidationResultType.VALID;

interface ValidationData {
  readonly touch: (field: Field) => void;
  readonly validateForSave: () => boolean;
  readonly validateForDelete: () => ErrorOrFailureValidationResult[];
  readonly getErrorResults: () => ErrorOrFailureValidationResult[];
}

export const ValidationContext = React.createContext<
  ValidationData | undefined
>(undefined) as React.Context<ValidationData>;
