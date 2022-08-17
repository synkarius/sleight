import { ErrorCode } from '../../../error/error-codes';
import { alwaysTrue } from '../../../util/common-functions';
import {
  createNameTakenValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { Action } from './action';

const nameTakenValidator = createNameTakenValidator<Action, Action>(
  Field.AC_NAME,
  (data) => data.actions,
  'an action already exists with this name',
  ValidationErrorCode.AC_NAME_TAKEN
);

export const getActionValidators: () => FieldValidator<Action>[] = () => [
  nameTakenValidator,
];
