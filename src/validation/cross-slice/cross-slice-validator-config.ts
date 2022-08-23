import { Field } from '../validation-field';
import { DataTransformFunction } from './data-transform-fn';

export type CrossSliceValidatorConfig<E> = {
  /** triggers validation on touch */
  field: Field;
  /** determines applicability per type */
  isApplicable: (element: E) => boolean;
  /** alter the data in some (immutable) way before validating */
  dataTransformFn: DataTransformFunction<E>;
  /** error message for one of the 'sides' of the validation */
  sliceSpecificErrorMessage?: string;
};
