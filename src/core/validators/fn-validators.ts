import { Fn } from '../../data/model/fn/fn';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import { createValidator } from '../../validation/validator-factories';
import { alwaysTrue, isEmpty } from '../common/common-functions';

const nameNonEmptyValidator: FieldValidator<Fn> = createValidator(
  Field.FN_NAME,
  alwaysTrue,
  (fn) => !isEmpty(fn.name),
  ValidationErrorCode.FN_NAME_EMPTY,
  'function name must not be empty'
);

export const getFnValidators = () => [nameNonEmptyValidator];
