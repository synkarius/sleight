import {
  isDefined,
  isIdSelected,
  Predicate,
  singletonArray,
} from '../common/common-functions';
import { MapUtil } from '../common/map-util';
import {
  optionalityConfigForSpec,
  optionalityConfigForVariable,
} from '../../validation/cross-slice/cross-slice-validation-configs';
import {
  createCrossSliceValidator,
  ValidatorFn,
} from '../../validation/cross-slice/cross-slice-validator-factory';
import {
  specDataCopierFn,
  variableDataCopierFn,
} from '../../validation/cross-slice/data-copier-fns';
import { givenVariableFindSpecs } from '../../validation/cross-slice/finder-fns';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../validation/validation-result';
import { ElementType } from '../../data/model/element-types';
import {
  isVariableSpecItem,
  Spec,
  VariableSpecItem,
} from '../../data/model/spec/spec-domain';
import { Variable } from '../../data/model/variable/variable';

type InvalidSpecDetails = {
  specName: string;
  specItemId: string;
  variableName: string;
};

const specOptionalityValidatorFn: ValidatorFn<Spec> = (specs, data, config) => {
  // get specs where their variables don't have defaults but the specs are optional
  const invalid = specs
    .flatMap((spec) =>
      spec.items
        .filter(isVariableSpecItem)
        .filter((item) => isIdSelected(item.variableId))
        .map((item: VariableSpecItem): InvalidSpecDetails | undefined => {
          const variable = MapUtil.getOrThrow(data.variables, item.variableId);
          if (item.optional && !isDefined(variable.defaultValue)) {
            return {
              specName: spec.name,
              specItemId: item.id,
              variableName: variable.name,
            };
          }
        })
        .filter(isDefined)
    )
    .filter(isDefined);
  if (!!invalid.length) {
    switch (config.editingElementType) {
      case ElementType.Enum.SPEC:
        const varsNoDefaults = Array.from(
          new Set(invalid.map((i) => i.variableName))
        ).join('", "');
        return {
          field: Field.SP_TOGGLE_SPEC_ITEM_OPTIONAL,
          type: ValidationResultType.ID_LIST,
          code: ValidationErrorCode.SP_OPTIONALITY,
          message:
            'optional variable spec items require variables with defaults;' +
            ' the following variables used by this spec have no defaults:' +
            ` "${varsNoDefaults}"`,
          ids: invalid.map((i) => i.specItemId),
        };
      case ElementType.Enum.VARIABLE:
        const specsOptional = Array.from(
          new Set(invalid.map((i) => i.specName))
        ).join('", "');
        return {
          field: Field.VAR_USE_DEFAULT,
          type: ValidationResultType.BASIC,
          code: ValidationErrorCode.SP_OPTIONALITY,
          message:
            'a default is required because the following specs use this' +
            ` variable in optional variable spec items: "${specsOptional}"`,
        };
      default:
    }
  }
  return validResult(config.touchTriggersValidationFields[0]);
};

const specApplicability: Predicate<Spec> = (spec) =>
  !!spec.items.find((item) => item.optional);

// optionality: spec side
export const getSpecItemOptionalityValidator: () => FieldValidator<Spec> = () =>
  createCrossSliceValidator(
    specDataCopierFn,
    singletonArray,
    specApplicability,
    specOptionalityValidatorFn,
    optionalityConfigForSpec
  );
// optionality: variable side
export const getVariableOptionalityValidator: () => FieldValidator<Variable> =
  () =>
    createCrossSliceValidator(
      variableDataCopierFn,
      givenVariableFindSpecs,
      specApplicability,
      specOptionalityValidatorFn,
      optionalityConfigForVariable
    );
