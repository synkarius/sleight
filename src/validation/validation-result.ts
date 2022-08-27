import { ValidationErrorCode } from './validation-error-code';
import { Field } from './validation-field';

export enum ValidationResultType {
  VALID,
  BASIC,
  ID_LIST,
  MULTI_FIELD,
}

interface AbstractValidationResult {
  readonly type: ValidationResultType;
}

/**
 * The only valid result: contains no error info.
 */
interface ValidValidationResult extends AbstractValidationResult {
  readonly type: typeof ValidationResultType.VALID;
  readonly field: Field;
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
  readonly field: Field;
}

/**
 * Includes a list of ids which are responsible for an invalid result.
 * If the result is valid, the list should be empty.
 */
export interface IdListValidationResult
  extends AbstractInvalidValidationResult {
  readonly type: typeof ValidationResultType.ID_LIST;
  readonly field: Field;
  readonly ids: string[];
}

interface MultiFieldValidationResult extends AbstractInvalidValidationResult {
  readonly type: typeof ValidationResultType.MULTI_FIELD;
  readonly errorHighlightFields: Field[];
  readonly ids: string[];
}

export type ErrorValidationResult =
  | BasicValidationResult
  | IdListValidationResult
  | MultiFieldValidationResult;

export type ValidationResult = ValidValidationResult | ErrorValidationResult;
