import { Field } from './validation-field';
import { ValidationResult } from './validation-result';
import { SleightDataInternalFormat } from '../data/data-formats';
import { ValidateMode } from './ValidationComponent';

export enum ValidatorType {
  FIELD,
  FIELDS,
}

interface AbstractValidator<T> {
  readonly validatorType: ValidatorType;
  readonly isApplicable: (t: T) => boolean;
  readonly validate: (
    t: T,
    data: Readonly<SleightDataInternalFormat>
  ) => ValidationResult;
}

export interface SingleFieldValidator<T> extends AbstractValidator<T> {
  readonly validatorType: typeof ValidatorType.FIELD;
  /** Field which triggers validation on "touched". */
  readonly field: Field;
  readonly exclusiveValidationMode?: ValidateMode;
}

interface FieldsValidator<T> extends AbstractValidator<T> {
  readonly validatorType: typeof ValidatorType.FIELDS;
  /** Fields which trigger validation on "touched". */
  readonly fields: Field[];
}

export type FieldValidator<T> = SingleFieldValidator<T> | FieldsValidator<T>;

export const isDeletionValidator = <T>(validator: FieldValidator<T>): boolean =>
  validator.validatorType === ValidatorType.FIELD &&
  validator.exclusiveValidationMode === ValidateMode.DELETE;
