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

interface SingleFieldValidator<T> extends AbstractValidator<T> {
  readonly validatorType: typeof ValidatorType.FIELD;
  readonly field: Field;
  readonly exclusiveValidationMode?: ValidateMode;
}

interface FieldsValidator<T> extends AbstractValidator<T> {
  readonly validatorType: typeof ValidatorType.FIELDS;
  readonly fields: Field[];
}

export type FieldValidator<T> = SingleFieldValidator<T> | FieldsValidator<T>;
