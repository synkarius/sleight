import { alwaysTrue, notEmpty } from '../../../util/common-functions';
import {
  createValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { RoleKey } from './role-key';

export const roleKeyTextValidator: FieldValidator<RoleKey> = createValidator(
  Field.RK_ROLE_KEY,
  alwaysTrue,
  (roleKey) => notEmpty(roleKey.value),
  ValidationErrorCode.RK_EMPTY,
  "role key can't be empty"
);
