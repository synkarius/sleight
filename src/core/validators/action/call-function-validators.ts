import { Action } from '../../../data/model/action/action';
import { isVariableActionValue } from '../../../data/model/action/action-value';
import { isCallFunctionAction } from '../../../data/model/action/call-function/call-function';
import {
  FieldValidator,
  ValidatorType,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import { createValidator } from '../../../validation/validator-factories';
import { isIdSelected } from '../../common/common-functions';

const fnSelectedValidator: FieldValidator<Action> = createValidator(
  Field.AC_CALL_FUNC_FN,
  isCallFunctionAction,
  (action) => isCallFunctionAction(action) && isIdSelected(action.functionId),
  ValidationErrorCode.AC_FN_NOT_SELECTED,
  'a function must be selected'
);

const fnParamVariableSelectedValidator: FieldValidator<Action> = {
  validatorType: ValidatorType.FIELD,
  field: Field.AC_CALL_FUNC_PARAMETER_VAR,
  isApplicable: isCallFunctionAction,
  validate: (action) => {
    const invalidActionValueIds = isCallFunctionAction(action)
      ? action.parameters
          .filter(isVariableActionValue)
          .filter((av) => !isIdSelected(av.variableId))
          .map((av) => av.id)
      : [];
    return !invalidActionValueIds.length
      ? validResult(Field.AC_CALL_FUNC_PARAMETER_VAR)
      : {
          type: ValidationResultType.ID_LIST,
          field: Field.AC_CALL_FUNC_PARAMETER_VAR,
          code: ValidationErrorCode.AC_FN_VAR_NOT_SELECTED,
          message: 'variable parameters must be selected',
          ids: invalidActionValueIds,
        };
  },
};

export const getCallFunctionValidators: () => FieldValidator<Action>[] = () => [
  fnSelectedValidator,
  fnParamVariableSelectedValidator,
];
