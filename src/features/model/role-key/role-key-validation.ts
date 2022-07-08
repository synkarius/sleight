import { Validator } from '../../../validation/validator';

export enum RoleKeyValidationError {
  ROLE_KEY_IS_EMPTY = "role key can't be empty",
}

export const roleKeyTextValidator: Validator<string, RoleKeyValidationError> = {
  test: (roleKeyText) => roleKeyText.trim().length > 0,
  error: RoleKeyValidationError.ROLE_KEY_IS_EMPTY,
};
