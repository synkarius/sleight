import { ValidationErrorCode } from './validation-error-code';
import { Field } from './validation-field';

export enum ValidationResultType {
  /** An error was thrown during validation. */
  VALIDATION_FAILED,
  /** Everything validated. */
  VALID,
  /** A single field invalidated. */
  BASIC,
  /** Multiple ided form fields under the same Field are invalidated. */
  ID_LIST,
  /** Only used for the spec adequacy cross-slice validator. */
  FIELDS_AND_IDS,
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
  ValidationResultType.FIELDS_AND_IDS,
];

interface AbstractInvalidValidationResult extends AbstractValidationResult {
  readonly type:
    | typeof ValidationResultType.BASIC
    | typeof ValidationResultType.ID_LIST
    | typeof ValidationResultType.FIELDS_AND_IDS;
  readonly code: ValidationErrorCode;
  readonly message: string;
}

/**
 * A basic result: only has the `valid` boolean.
 */
interface BasicValidationResult extends AbstractInvalidValidationResult {
  readonly type: typeof ValidationResultType.BASIC;
  readonly errorHighlightField: Field;
}

/**
 * Includes a list of ids which are responsible for an invalid result.
 * The list should never be empty if this result type is returned.
 */
export interface IdListValidationResult
  extends AbstractInvalidValidationResult {
  readonly type: typeof ValidationResultType.ID_LIST;
  readonly errorHighlightField: Field;
  readonly ids: string[];
}

/**
 * As of time of writing, is only used for the
 * spec adequacy cross-slice validator. Requires both fields and ids
 * because of CallFunctionAction.
 */
interface FieldsAndIdsValidationResult extends AbstractInvalidValidationResult {
  readonly type: typeof ValidationResultType.FIELDS_AND_IDS;
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
  readonly errorHighlightField: Field;
  readonly message: string;
};

export const isValidationFailedValidationResult = (
  result: ValidationResult
): result is FailedValidationResult =>
  result.type === ValidationResultType.VALIDATION_FAILED;

export type ErrorValidationResult =
  | BasicValidationResult
  | IdListValidationResult
  | FieldsAndIdsValidationResult;

export const isErrorValidationResult = (
  result: ValidationResult
): result is ErrorValidationResult => errorResultTypes.includes(result.type);

export type ValidationResult =
  | ValidValidationResult
  | ErrorValidationResult
  | FailedValidationResult;
