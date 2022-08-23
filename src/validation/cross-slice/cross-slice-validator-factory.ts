import { Context } from '../../features/model/context/context';
import { alwaysTrue } from '../../util/common-functions';
import { FieldValidator } from '../field-validator';
import { Field } from '../validation-field';
import { validResult } from '../validation-result';
import { CrossSliceValidatorConfig } from './cross-slice-validator-config';
import { addEditingContextToDataCopy } from './data-transform-fn';
import { ValidateAllFunction } from './validate-all-fn';

export const createCrossSliceValidator = <E>(
  config: CrossSliceValidatorConfig<E>,
  validateAllFn: ValidateAllFunction
): FieldValidator<E> => {
  return {
    field: config.field,
    isApplicable: config.isApplicable,
    validate: (t, data) => {
      const transformedData = config.dataTransformFn(t, data);
      const result = validateAllFn(transformedData);
      return config.sliceSpecificErrorMessage
        ? { ...result, message: config.sliceSpecificErrorMessage }
        : result;
    },
  };
};

const someValidateAllfn: ValidateAllFunction = (data) =>
  validResult(Field.CMD_NAME);

const ctxValCrit: CrossSliceValidatorConfig<Context> = {
  field: Field.CMD_NAME,
  isApplicable: alwaysTrue,
  dataTransformFn: addEditingContextToDataCopy,
};

const csValidator = createCrossSliceValidator(ctxValCrit, someValidateAllfn);
