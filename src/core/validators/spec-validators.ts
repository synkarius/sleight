import { alwaysTrue, isEmpty } from '../common/common-functions';
import {
  FieldValidator,
  ValidatorType,
} from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../validation/validation-result';
import { ValidateMode } from '../../validation/ValidationComponent';
import { UNSELECTED_ID } from '../common/consts';
import { Spec } from '../../data/model/spec/spec-domain';
import { SpecDTO } from '../../data/model/spec/spec-dto';
import { SpecItemType } from '../../data/model/spec/spec-item-type';
import {
  createRoleKeyTakenValidator,
  createValidator,
} from '../../validation/validator-factories';
import { mapSpecToPreview } from '../../ui/model/spec/spec-preview';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';
import { VariableDTO } from '../../data/model/variable/variable-dto';

const roleKeyTakenValidator = createRoleKeyTakenValidator<SpecDTO, Spec>(
  Field.SP_ROLE_KEY,
  (data) => data.specs,
  'a spec already exists with this role key',
  ValidationErrorCode.SP_RK_TAKEN
);

const atLeastOneSpecItem: FieldValidator<Spec> = createValidator(
  Field.SP_ADD_ITEM_BUTTON,
  alwaysTrue,
  (spec) => spec.items.length > 0,
  ValidationErrorCode.SP_GTE1_SPEC_ITEM,
  'at least one spec item must be added'
);

const atLeastOneNonOptionalSpecItem: FieldValidator<Spec> = createValidator(
  Field.SP_TOGGLE_SPEC_ITEM_OPTIONAL,
  (spec) => spec.items.length > 0,
  (spec) => spec.items.filter((specItem) => !specItem.optional).length > 0,
  ValidationErrorCode.SP_GTE1_NON_OPTIONAL_SPEC_ITEM,
  'at least one spec item must be non-optional'
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
  validatorType: ValidatorType.FIELD,
  field: specItemSelectorFields,
  isApplicable: (spec) =>
    !!spec.items.find((item) => item.itemType === SpecItemType.Enum.SELECTOR),
  validate: (spec) => {
    const invalidIds = findInvalidSelectorIds(spec);
    return invalidIds.length === 0
      ? validResult(specItemSelectorFields)
      : {
          type: ValidationResultType.ID_LIST,
          errorHighlightField: specItemSelectorFields,
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
        specItem.variableId === UNSELECTED_ID
    )
    .map((specItem) => specItem.id);
};

const specItemVariableFields = Field.SP_ITEM_VARIABLE;
const specVariableMustBeSelected: FieldValidator<Spec> = {
  validatorType: ValidatorType.FIELD,
  field: specItemVariableFields,
  isApplicable: (spec) =>
    !!spec.items.find((item) => item.itemType === SpecItemType.Enum.VARIABLE),
  validate: (spec) => {
    const invalidIds = findSpecItemsWithUnselectedVariables(spec);
    return invalidIds.length === 0
      ? validResult(specItemVariableFields)
      : {
          type: ValidationResultType.ID_LIST,
          errorHighlightField: specItemVariableFields,
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
  validatorType: ValidatorType.FIELD,
  field: specItemSelectorFields,
  isApplicable: (spec) =>
    !!spec.items.find((item) => item.itemType === SpecItemType.Enum.SELECTOR),
  validate: (spec) => {
    const invalidIds = findNonAlphaSpaceSelectors(spec);
    return invalidIds.length === 0
      ? validResult(specItemSelectorFields)
      : {
          type: ValidationResultType.ID_LIST,
          errorHighlightField: specItemSelectorFields,
          code: ValidationErrorCode.SP_VAR_NON_ALPHASPACE_SELECTOR,
          message: 'selectors must only be alphabetic or spaces',
          ids: invalidIds,
        };
  },
};

const deletionValidator: FieldValidator<Spec> = {
  validatorType: ValidatorType.FIELD,
  exclusiveValidationMode: ValidateMode.DELETE,
  field: Field.SP_DELETE,
  isApplicable: alwaysTrue,
  validate: (spec, data) => {
    const commandsUsingSpec = Object.values(data.commands)
      .filter((command) => command.specId === spec.id)
      .map((command) => command.name);
    const commandsStr = commandsUsingSpec.join('", "');
    return commandsUsingSpec.length === 0
      ? validResult(Field.SP_DELETE)
      : {
          type: ValidationResultType.BASIC,
          errorHighlightField: Field.SP_DELETE,
          code: ValidationErrorCode.SP_USED_AND_DELETE_ATTEMPTED,
          message:
            'cannot delete: this spec is used in command(s):' +
            ` "${commandsStr}"`,
        };
  },
};

const getSpecPreviewComparable = (
  spec: Spec,
  variables: Readonly<Record<string, VariableDTO>>
): string => {
  return mapSpecToPreview(spec, variables).toLowerCase();
};

/** Compares spec previews rather than full variable
 * permutations. Probably good enough in most cases.
 */
const basicSpecUniquenessValidator: FieldValidator<Spec> = {
  validatorType: ValidatorType.FIELD,
  field: Field.SP_SAVE,
  isApplicable: (spec) => !!spec.items.length,
  validate: (spec, data) => {
    const specMapper = container.get(Tokens.DomainMapper_Spec);
    const existingSpecPreviews = Object.values(data.specs)
      .filter((specDTO) => specDTO.id !== spec.id)
      .map((sp) => specMapper.mapToDomain(sp, data.selectors))
      .map((sp) => ({
        name: sp.name,
        preview: getSpecPreviewComparable(sp, data.variables),
      }));
    const editingSpecPreview = getSpecPreviewComparable(spec, data.variables);
    for (const existingSpecPreview of existingSpecPreviews) {
      if (existingSpecPreview.preview === editingSpecPreview) {
        return {
          type: ValidationResultType.BASIC,
          errorHighlightField: Field.SP_SAVE,
          code: ValidationErrorCode.SP_UNIQUENESS,
          message:
            'specs must be unique; this spec is duplicated by:' +
            ` "${existingSpecPreview.name}"`,
        };
      }
    }
    return validResult(Field.SP_SAVE);
  },
};

export const getSpecValidators: () => FieldValidator<Spec>[] = () => [
  roleKeyTakenValidator,
  atLeastOneSpecItem,
  atLeastOneNonOptionalSpecItem,
  specSelectorItemsCantBeEmpty,
  specVariableMustBeSelected,
  specSelectorMustBeAlphaSpace,
  basicSpecUniquenessValidator,
  deletionValidator,
];
