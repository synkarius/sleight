import { alwaysTrue, isEmpty } from '../../../util/common-functions';
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
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { Spec } from './data/spec-domain';
import { SpecDTO } from './data/spec-dto';
import { SpecItemType } from './spec-item-type';

const nameTakenValidator = createNameTakenValidator<SpecDTO, Spec>(
  Field.SP_NAME,
  (data) => data.specs,
  'a spec already exists with this name',
  ValidationErrorCode.SP_NAME_TAKEN
);

const atLeastOneSpecItem: FieldValidator<Spec> = createValidator(
  Field.SP_ADD_ITEM_BUTTON,
  alwaysTrue,
  (spec) => spec.items.length > 0,
  ValidationErrorCode.SP_GTE1_SPEC_ITEM,
  'at least one spec item must be added'
);

const findInvalidSelectorIds = (spec: Spec): string[] => {
  const selectorItems = spec.items.flatMap((specItem) =>
    specItem.itemType === SpecItemType.Enum.SELECTOR
      ? specItem.selector.items
      : []
  );
  return selectorItems
    .filter((selectorItem) => isEmpty(selectorItem.value))
    .map((selectorItem) => selectorItem.id);
};

const specItemSelectorFields = Field.SP_ITEM_SELECTOR;
const specSelectorItemsCantBeEmpty: FieldValidator<Spec> = {
  field: specItemSelectorFields,
  isApplicable: (spec) =>
    !!spec.items.find((item) => item.itemType === SpecItemType.Enum.SELECTOR),
  validate: (spec) => {
    const invalidIds = findInvalidSelectorIds(spec);
    return invalidIds.length === 0
      ? validResult(specItemSelectorFields)
      : {
          type: ValidationResultType.ID_LIST,
          field: specItemSelectorFields,
          code: ValidationErrorCode.SP_EMPTY_SELECTOR,
          message: 'selectors may not be empty',
          ids: invalidIds,
        };
  },
};

const findSpecItemsWithUnselectedVariables = (spec: Spec): string[] => {
  return spec.items
    .filter(
      (specItem) =>
        specItem.itemType === SpecItemType.Enum.VARIABLE &&
        specItem.variableId === SELECT_DEFAULT_VALUE
    )
    .map((specItem) => specItem.id);
};

const specItemVariableFields = Field.SP_ITEM_VARIABLE;
const specVariableMustBeSelected: FieldValidator<Spec> = {
  field: specItemVariableFields,
  isApplicable: (spec) =>
    !!spec.items.find((item) => item.itemType === SpecItemType.Enum.VARIABLE),
  validate: (spec) => {
    const invalidIds = findSpecItemsWithUnselectedVariables(spec);
    return invalidIds.length === 0
      ? validResult(specItemVariableFields)
      : {
          type: ValidationResultType.ID_LIST,
          field: specItemVariableFields,
          code: ValidationErrorCode.SP_VAR_NOT_SELECTED,
          message: 'variable must be selected',
          ids: invalidIds,
        };
  },
};

const findNonAlphaSpaceSelectors = (spec: Spec): string[] => {
  return spec.items
    .flatMap(
      (specItem) =>
        (specItem.itemType === SpecItemType.Enum.SELECTOR &&
          specItem.selector.items) ||
        []
    )
    .filter((selectorItem) => !selectorItem.value.match(/^[a-zA-Z ]*$/))
    .map((selectorItem) => selectorItem.id);
};

const specSelectorMustBeAlphaSpace: FieldValidator<Spec> = {
  field: specItemSelectorFields,
  isApplicable: (spec) =>
    !!spec.items.find((item) => item.itemType === SpecItemType.Enum.SELECTOR),
  validate: (spec) => {
    const invalidIds = findNonAlphaSpaceSelectors(spec);
    return invalidIds.length === 0
      ? validResult(specItemSelectorFields)
      : {
          type: ValidationResultType.ID_LIST,
          field: specItemSelectorFields,
          code: ValidationErrorCode.SP_VAR_NON_ALPHASPACE_SELECTOR,
          message: 'selectors must only be alphabetic or spaces',
          ids: invalidIds,
        };
  },
};

export const getSpecValidators: () => FieldValidator<Spec>[] = () => [
  nameTakenValidator,
  atLeastOneSpecItem,
  specSelectorItemsCantBeEmpty,
  specVariableMustBeSelected,
  specSelectorMustBeAlphaSpace,
];
