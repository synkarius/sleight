import { FieldValidator } from '../field-validator';
import { ValidationResultType } from '../validation-result';
import { CrossSliceValidatorConfig } from './cross-slice-validator-config';
import { ValidateAllFunction } from './validate-all-fn';

export const createCrossSliceValidator = <E>(
  config: CrossSliceValidatorConfig<E>,
  validateAllFn: ValidateAllFunction
): FieldValidator<E> => {
  return {
    field: config.field,
    isApplicable: config.isApplicable,
    validate: (editing, data) => {
      const transformedData = config.dataTransformFn(editing, data);
      const result = validateAllFn(transformedData);
      return result.type !== ValidationResultType.VALID &&
        config.sliceSpecificErrorMessage
        ? { ...result, message: config.sliceSpecificErrorMessage }
        : result;
    },
  };
};
