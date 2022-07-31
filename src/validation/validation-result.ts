import { ValidationErrorCode } from './validation-error-code';
import { Field } from './validation-field';

export enum ValidationResultType {
  VALID,
  BASIC,
  ID_LIST,
}

interface AbstractValidationResult {
  readonly type: ValidationResultType;
  readonly field: Field;
}

/**
 * The only valid result: contains no error info.
 */
interface ValidValidationResult extends AbstractValidationResult {
  readonly type: typeof ValidationResultType.VALID;
}

export const validResult = (field: Field): ValidValidationResult => ({
  type: ValidationResultType.VALID,
  field: field,
});

interface AbstractInvalidValidationResult extends AbstractValidationResult {
  readonly type: ValidationResultType;
  readonly code: ValidationErrorCode;
  readonly message: string;
}

/**
 * A basic result: only has the `valid` boolean.
 */
interface BasicValidationResult extends AbstractInvalidValidationResult {
  readonly type: typeof ValidationResultType.BASIC;
}

/**
 * Includes a list of ids which are responsible for an invalid result.
 * If the result is valid, the list should be empty.
 */
export interface IdListValidationResult
  extends AbstractInvalidValidationResult {
  readonly type: typeof ValidationResultType.ID_LIST;
  readonly ids: string[];
}

export type ErrorValidationResult =
  | BasicValidationResult
  | IdListValidationResult;

export type ValidationResult = ValidValidationResult | ErrorValidationResult;
