import { SleightDataInternalFormat } from '../../data/data-formats';
import { alwaysTrue, Predicate } from '../../util/common-functions';
import { FieldValidator, ValidatorType } from '../field-validator';
import { ValidationResult } from '../validation-result';
import { ValidationConfig } from './cross-slice-validator-config';
import { DataCopierFn } from './data-copier-fns';
import { FinderFn } from './finder-fns';

export type ValidatorFn<V> = (
  validated: V[],
  data: SleightDataInternalFormat,
  config: ValidationConfig
) => ValidationResult;

/**
 * E: the edited type
 *
 * V: the validated type
 *
 * @param dataCopierFn
 * @param finderFn
 * @param applicabilityFn determines whether the found validateable elements should be validated
 * @param validatorFn
 * @param config
 * @returns
 */
export const createCrossSliceValidator = <E, V>(
  dataCopierFn: DataCopierFn<E>,
  finderFn: FinderFn<E, V>,
  applicabilityFn: Predicate<V>,
  validatorFn: ValidatorFn<V>,
  config: ValidationConfig
): FieldValidator<E> => {
  return {
    validatorType: ValidatorType.FIELDS,
    fields: config.touchTriggersValidationFields,
    // TODO: the validator producer is for the editing type, but the isApplicable passed in
    // is for the validated type -- figure that out instead of this `alwaysTrue`
    isApplicable: alwaysTrue,
    validate: (editing, data) => {
      const dataCopy = dataCopierFn(editing, data);
      const validated: V[] = finderFn(editing, dataCopy).filter(
        applicabilityFn
      );
      return validatorFn(validated, dataCopy, config);
    },
  };
};
