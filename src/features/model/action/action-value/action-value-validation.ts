import { FieldValidator } from '../../../../validation/field-validator';
import { ValidationErrorCode } from '../../../../validation/validation-error-code';
import { Field } from '../../../../validation/validation-field';
import {
  ValidationResult,
  ValidationResultType,
} from '../../../../validation/validation-result';
import { VariableDTO } from '../../variable/data/variable-dto';
import { VariableType } from '../../variable/variable-types';
import { Action } from '../action';
import { RoleKeyActionValue } from './action-value';

export type ActionValueValidators = {
  readonly value?: FieldValidator<Action>;
  readonly variable: FieldValidator<Action>;
  readonly roleKeySelected: FieldValidator<Action>;
  readonly roleKeyedElementExists: FieldValidator<Action>;
};

export const createNonSelectedEnumError = (fieldName: string) =>
  fieldName + ' : value must be selected';
export const createNonSelectedVariableError = (fieldName: string) =>
  fieldName + ' : variable must be selected';
export const createNonSelectedRoleKeyError = (fieldName: string) =>
  fieldName + ' : role key must be selected';
export const VAR_FOR_RK_NOT_EXISTS = 'variable does not exist for role key';
export const VAR_FOR_RK_EXISTS_BUT_WRONG_TYPE =
  'variable for role key is wrong type';

export const getRoleKeyExistsError = (
  field: Field,
  variableType: VariableType.Type,
  actionValue: RoleKeyActionValue,
  variables: Readonly<Record<string, VariableDTO>>
): ValidationResult | undefined => {
  const roleKeyMatchedVariables = Object.values(variables).filter(
    (variable) => variable.roleKeyId === actionValue.roleKeyId
  );
  if (roleKeyMatchedVariables.length === 0) {
    return {
      type: ValidationResultType.BASIC,
      field,
      code: ValidationErrorCode.AC_AV_RK_VAR_NOT_EXISTS,
      message: VAR_FOR_RK_NOT_EXISTS,
    };
  }
  if (
    !roleKeyMatchedVariables.find((variable) => variable.type === variableType)
  ) {
    return {
      type: ValidationResultType.BASIC,
      field,
      code: ValidationErrorCode.AC_AV_RK_VAR_WRONG_TYPE,
      message: VAR_FOR_RK_EXISTS_BUT_WRONG_TYPE,
    };
  }
};
