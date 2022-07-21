import { alwaysTrue, notEmpty } from '../../../util/common-functions';
import {
  createFieldValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { Field } from '../../../validation/validation-field';
import { createValidationError } from '../../../validation/validator';
import { RoleKey } from './role-key';

export const roleKeyTextValidator: FieldValidator<RoleKey> =
  createFieldValidator(
    Field.RK_ROLE_KEY,
    alwaysTrue,
    (rk) => notEmpty(rk.value),
    createValidationError("role key can't be empty")
  );
