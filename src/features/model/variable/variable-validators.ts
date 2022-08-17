import { isEmpty } from '../../../util/common-functions';
import {
  createNameTakenValidator,
  createValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import {
  ChoiceVariable,
  isChoiceVariable,
  isRangeVariable,
  Variable,
} from './data/variable';
import { VariableDTO } from './data/variable-dto';

const nameTakenValidator = createNameTakenValidator<VariableDTO, Variable>(
  Field.VAR_NAME,
  (data) => data.variables,
  'a variable already exists with this name',
  ValidationErrorCode.VAR_NAME_TAKEN
);

const rangeMaxIsGreaterThanOrEqualsRangeMin: FieldValidator<Variable> =
  createValidator(
    Field.VAR_RANGE_MAX,
    (variable) => isRangeVariable(variable),
    (variable) =>
      isRangeVariable(variable) &&
      variable.endInclusive >= variable.beginInclusive,
    ValidationErrorCode.VAR_MIN_GT_MAX,
    'maximum cannot be less than minimum'
  );

const atLeastOneChoiceItem: FieldValidator<Variable> = createValidator(
  Field.VAR_ADD_ITEM_BUTTON,
  (variable) => isChoiceVariable(variable),
  (variable) => isChoiceVariable(variable) && variable.items.length > 0,
  ValidationErrorCode.VAR_GTE1_CHOICE_ITEM,
  'at least one choice item must be added'
);

const findEmptySelectorIds = (choiceVariable: ChoiceVariable): string[] => {
  return choiceVariable.items
    .flatMap((choiceItem) => choiceItem.selector.items)
    .filter((selectorItem) => isEmpty(selectorItem.value))
    .map((selectorItem) => selectorItem.id);
};

const choiceItemSelectorFields = Field.VAR_CHOICE_ITEM_SELECTOR;
const choiceSelectorItemsCantBeEmpty: FieldValidator<Variable> = {
  field: choiceItemSelectorFields,
  isApplicable: (variable) => isChoiceVariable(variable),
  validate: (variable) => {
    const invalidIds = isChoiceVariable(variable)
      ? findEmptySelectorIds(variable)
      : [];
    return invalidIds.length === 0
      ? validResult(choiceItemSelectorFields)
      : {
          type: ValidationResultType.ID_LIST,
          field: choiceItemSelectorFields,
          code: ValidationErrorCode.VAR_EMPTY_SELECTOR,
          message: 'selectors may not be empty',
          ids: invalidIds,
        };
  },
};

const findNonAlphaOrSpaceSelectorIds = (
  choiceVariable: ChoiceVariable
): string[] => {
  return choiceVariable.items
    .flatMap((choiceItem) => choiceItem.selector.items)
    .filter((selectorItem) => !selectorItem.value.match(/^[a-zA-Z ]*$/))
    .map((selectorItem) => selectorItem.id);
};

const choiceSelectorItemsCantBeNonAlphaOrSpaces: FieldValidator<Variable> = {
  field: choiceItemSelectorFields,
  isApplicable: (variable) => isChoiceVariable(variable),
  validate: (variable) => {
    const invalidIds = isChoiceVariable(variable)
      ? findNonAlphaOrSpaceSelectorIds(variable)
      : [];
    return invalidIds.length === 0
      ? validResult(choiceItemSelectorFields)
      : {
          type: ValidationResultType.ID_LIST,
          field: choiceItemSelectorFields,
          code: ValidationErrorCode.VAR_NON_ALPHASPACE_SELECTOR,
          message: 'selectors must only be alphabetic or spaces',
          ids: invalidIds,
        };
  },
};

export const getVariableValidators: () => FieldValidator<Variable>[] = () => [
  nameTakenValidator,
  rangeMaxIsGreaterThanOrEqualsRangeMin,
  atLeastOneChoiceItem,
  choiceSelectorItemsCantBeEmpty,
  choiceSelectorItemsCantBeNonAlphaOrSpaces,
];
