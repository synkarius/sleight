import { Action } from '../../../data/model/action/action';
import {
  isEnterTextActionValue,
  isVariableActionValue,
} from '../../../data/model/action/action-value';
import { isMimicAction } from '../../../data/model/action/mimic/mimic';
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

const WORDS = 'words';
const wordsValidators: ActionValueValidators = {
  value: createValidator(
    Field.AC_MIMIC_WORDS_VALUE,
    (action) =>
      isMimicAction(action) &&
      !isVariableActionValue(action.words) &&
      isEnterTextActionValue(action.words),
    (action) =>
      isMimicAction(action) &&
      !isVariableActionValue(action.words) &&
      isEnterTextActionValue(action.words) &&
      notEmpty(action.words.value),
    ValidationErrorCode.AC_AV_EMPTY,
    createEmptyError(WORDS)
  ),
  variable: createValidator(
    Field.AC_MIMIC_WORDS_VAR,
    (action) => isMimicAction(action) && isVariableActionValue(action.words),
    (action) =>
      isMimicAction(action) &&
      isVariableActionValue(action.words) &&
      isIdSelected(action.words.variableId),
    ValidationErrorCode.AC_AV_VAR_NOT_SELECTED,
    createNonSelectedVariableError(WORDS)
  ),
};

export const getMimicValidators: () => FieldValidator<Action>[] = () =>
  [...Object.values(wordsValidators)].filter(isDefined);
