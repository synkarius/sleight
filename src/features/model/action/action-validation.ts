import { createValidationError } from '../../../validation/validator';
import { Validator } from '../../../validation/validator';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { ActionType } from './action-types';
import {
  ChoiceValue,
  RangeValue,
  TextValue,
} from './action-value/action-value';
import { ActionValueType } from './action-value/action-value-type';

export type TextValued = TextValue | ChoiceValue;
export type IdValued = TextValued | RangeValue;

const getNotEmptyValidator = (fieldName: string): Validator<TextValued> => {
  return {
    isValid: (actionValue: TextValued) => {
      return (
        ActionValueType.ENTER_VALUE !== actionValue.actionValueType ||
        (actionValue.value != null && actionValue.value.trim().length > 0)
      );
    },
    error: createValidationError(fieldName + " : can't be empty"),
  };
};

const getVariableNotSelectedValidator = (
  fieldName: string
): Validator<IdValued> => {
  return {
    isValid: (actionValue: IdValued) => {
      return (
        ActionValueType.USE_VARIABLE !== actionValue.actionValueType ||
        (actionValue.variableId != null &&
          actionValue.variableId !== SELECT_DEFAULT_VALUE)
      );
    },
    error: createValidationError(fieldName + ' : variable must be selected'),
  };
};

const getRoleKeyNotSelectedValidator = (
  fieldName: string
): Validator<IdValued> => {
  return {
    isValid: (actionValue: IdValued) => {
      return (
        ActionValueType.USE_ROLE_KEY !== actionValue.actionValueType ||
        (actionValue.roleKeyId != null &&
          actionValue.roleKeyId !== SELECT_DEFAULT_VALUE)
      );
    },
    error: createValidationError(fieldName + ' : role key must be selected'),
  };
};

export interface IdedValidators {
  variable: Validator<IdValued>;
  roleKey: Validator<IdValued>;
}

export interface TextValidators extends IdedValidators {
  value: Validator<TextValued>;
}

const KEY_TO_SEND = 'key to send';
export const keyToSendValidators: TextValidators = {
  value: getNotEmptyValidator(KEY_TO_SEND),
  variable: getVariableNotSelectedValidator(KEY_TO_SEND),
  roleKey: getRoleKeyNotSelectedValidator(KEY_TO_SEND),
};
const OUTER_PAUSE = 'outer pause';
export const outerPauseValidators: IdedValidators = {
  variable: getVariableNotSelectedValidator(OUTER_PAUSE),
  roleKey: getRoleKeyNotSelectedValidator(OUTER_PAUSE),
};
const INNER_PAUSE = 'outer pause';
export const innerPauseValidators: IdedValidators = {
  variable: getVariableNotSelectedValidator(INNER_PAUSE),
  roleKey: getRoleKeyNotSelectedValidator(INNER_PAUSE),
};
const REPEAT = 'repeat';
export const repeatValidators: IdedValidators = {
  variable: getVariableNotSelectedValidator(REPEAT),
  roleKey: getRoleKeyNotSelectedValidator(REPEAT),
};
const DIRECTION = 'direction';
// TODO: validate this differently so it can only be "up" or "down"
export const directionValidators: TextValidators = {
  value: getNotEmptyValidator(DIRECTION),
  variable: getVariableNotSelectedValidator(DIRECTION),
  roleKey: getRoleKeyNotSelectedValidator(DIRECTION),
};
