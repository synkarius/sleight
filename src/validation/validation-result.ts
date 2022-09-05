import { ValidationErrorCode } from './validation-error-code';
import { Field } from './validation-field';

export enum ValidationResultType {
  VALIDATION_FAILED,
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

export const isValidValidationResult = (
  result: ValidationResult
): result is ValidValidationResult =>
  result.type === ValidationResultType.VALID;

export const validResult = (field: Field): ValidValidationResult => ({
  type: ValidationResultType.VALID,
  field: field,
});

const errorResultTypes = [
  ValidationResultType.BASIC,
  ValidationResultType.ID_LIST,
  ValidationResultType.MULTI_FIELD,
];

interface AbstractInvalidValidationResult extends AbstractValidationResult {
  readonly type:
    | typeof ValidationResultType.BASIC
    | typeof ValidationResultType.ID_LIST
    | typeof ValidationResultType.MULTI_FIELD;
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

/**
 * Represents an execution failure in a validator, as a result
 * of a developer mistake, rather than a data integrity error
 * as a result of a user mistake.
 */
export type FailedValidationResult = {
  readonly type: typeof ValidationResultType.VALIDATION_FAILED;
  readonly field: Field;
  readonly message: string;
};

export const isValidationFailedValidationResult = (
  result: ValidationResult
): result is FailedValidationResult =>
  result.type === ValidationResultType.VALIDATION_FAILED;

export type ErrorValidationResult =
  | BasicValidationResult
  | IdListValidationResult
  | MultiFieldValidationResult;

export const isErrorValidationResult = (
  result: ValidationResult
): result is ErrorValidationResult => errorResultTypes.includes(result.type);

export type ValidationResult =
  | ValidValidationResult
  | ErrorValidationResult
  | FailedValidationResult;
