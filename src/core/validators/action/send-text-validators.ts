import { Action } from '../../../data/model/action/action';
import {
  isEnterTextActionValue,
  isVariableActionValue,
} from '../../../data/model/action/action-value';
import { isSendTextAction } from '../../../data/model/action/send-text/send-text';
import { FieldValidator } from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { createValidator } from '../../../validation/validator-factories';
import {
  isDefined,
  isIdSelected,
  notEmpty,
} from '../../common/common-functions';
import {
  ActionValueValidators,
  createEmptyError,
  createNonSelectedVariableError,
} from '../../reducers/action-value/action-value-validation-support';

const TEXT = 'text';
const textValidators: ActionValueValidators = {
  value: createValidator(
    Field.AC_ST_TEXT_VALUE,
    (action) =>
      isSendTextAction(action) &&
      !isVariableActionValue(action.text) &&
      isEnterTextActionValue(action.text),
    (action) =>
      isSendTextAction(action) &&
      !isVariableActionValue(action.text) &&
      isEnterTextActionValue(action.text) &&
      notEmpty(action.text.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createEmptyError(TEXT)
  ),
  variable: createValidator(
    Field.AC_ST_TEXT_VAR,
    (action) => isSendTextAction(action) && isVariableActionValue(action.text),
    (action) =>
      isSendTextAction(action) &&
      isVariableActionValue(action.text) &&
      isIdSelected(action.text.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(TEXT)
  ),
};

export const getSendTextValidators: () => FieldValidator<Action>[] = () =>
  [...Object.values(textValidators)].filter(isDefined);
