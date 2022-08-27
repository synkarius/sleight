import { alwaysTrue, notEmpty } from '../../../util/common-functions';
import {
  createValidator,
  FieldValidator,
  ValidatorType,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResult,
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import { RoleKey } from './role-key';

const rkValueField = Field.RK_ROLE_KEY;

const noDuplicatesValidator: FieldValidator<RoleKey> = {
  validatorType: ValidatorType.FIELD,
  field: rkValueField,
  isApplicable: alwaysTrue,
  validate: (action, data): ValidationResult => {
    const duplicateExists = !!Object.values(data.roleKeys)
      .filter((a) => a.id !== action.id)
      .find((a) => a.value === action.value);
    if (!duplicateExists) {
      return validResult(rkValueField);
    } else {
      return {
        type: ValidationResultType.BASIC,
        field: rkValueField,
        code: ValidationErrorCode.RK_DUPLICATE,
        message: 'a role key with that value exists already',
      };
    }
  },
};

const notEmptyValidator: FieldValidator<RoleKey> = createValidator(
  rkValueField,
  alwaysTrue,
  (roleKey) => notEmpty(roleKey.value),
  ValidationErrorCode.RK_EMPTY,
  "role key can't be empty"
);

export const getRoleKeyValidators: () => FieldValidator<RoleKey>[] = () => [
  noDuplicatesValidator,
  notEmptyValidator,
];
