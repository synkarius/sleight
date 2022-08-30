import { Predicate, singletonArray } from '../../../util/common-functions';
import {
  optionalityConfigForSpec,
  optionalityConfigForVariable,
} from '../../../validation/cross-slice/cross-slice-validation-configs';
import {
  createCrossSliceValidator,
  ValidatorFn,
} from '../../../validation/cross-slice/cross-slice-validator-factory';
import {
  specDataCopierFn,
  variableDataCopierFn,
} from '../../../validation/cross-slice/data-copier-fns';
import { givenVariableFindSpecs } from '../../../validation/cross-slice/finder-fns';
import { FieldValidator } from '../../../validation/field-validator';
import { validResult } from '../../../validation/validation-result';
import { Spec } from '../spec/data/spec-domain';
import { Variable } from './data/variable';

const specOptionalityValidatorFn: ValidatorFn<Spec> = (specs, data, config) => {
  // TODO: this
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
