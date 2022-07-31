import { alwaysTrue, isEmpty } from '../../../util/common-functions';
import {
  createValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import { Spec } from './data/spec-domain';
import { SpecItemType } from './spec-item-type';

export const atLeastOneSpecItem: FieldValidator<Spec> = createValidator(
  Field.SP_SAVE_BUTTON,
  alwaysTrue,
  (spec) => spec.items.length > 0,
  ValidationErrorCode.SPEC_GTE1_SPEC_ITEM,
  'at least one spec item must be added'
);

export const findInvalidSelectorIds = (spec: Spec): string[] => {
  const selectorItems = spec.items.flatMap((specItem) =>
    specItem.itemType === SpecItemType.Enum.SELECTOR
      ? specItem.selector.items
      : []
  );
  return selectorItems
    .filter((selectorItem) => isEmpty(selectorItem.value))
    .map((selectorItem) => selectorItem.id);
};

export const specSelectorItemsCantBeEmpty: FieldValidator<Spec> = {
  field: Field.SP_ITEM_SELECTOR,
  isApplicable: (spec) =>
    !!spec.items.find((item) => item.itemType === SpecItemType.Enum.SELECTOR),
  validate: (spec) => {
    const invalidIds = findInvalidSelectorIds(spec);
    return invalidIds.length === 0
      ? validResult(Field.SP_ITEM_SELECTOR)
      : {
          type: ValidationResultType.ID_LIST,
          field: Field.SP_ITEM_SELECTOR,
          code: ValidationErrorCode.SPEC_EMPTY_SELECTOR,
          message: 'selectors may not be empty',
          ids: invalidIds,
        };
  },
};
