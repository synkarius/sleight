import { alwaysTrue, isDefined } from '../core/common/common-functions';
import { ErrorOrFailureValidationResult } from './validation-context';
import { Field } from './validation-field';
import { ValidationResultType } from './validation-result';

type GetErrorMessageFn = (fields: Field[], id?: string) => string | undefined;

/**
 * Convenience method to get the singular error message for one or more fields.
 * @param errorResults
 * @returns
 */
export const processErrorResults = (
  errorResults: ErrorOrFailureValidationResult[]
): GetErrorMessageFn => {
  const errorMap = new Map<Field, ErrorOrFailureValidationResult>();
  for (const errorResult of errorResults) {
    const fields =
      errorResult.type === ValidationResultType.FIELDS_AND_IDS
        ? errorResult.errorHighlightFields
        : [errorResult.errorHighlightField];
    for (const field of fields) {
      errorMap.set(field, errorResult);
    }
  }
  return (fields: Field[], id?: string) => {
    return fields
      .map((field) => errorMap.get(field))
      .filter(isDefined)
      .filter((errorResult) => {
        // if the error result type has ids, also match on id
        const errorResultTypeHasIds =
          errorResult.type === ValidationResultType.ID_LIST ||
          errorResult.type === ValidationResultType.FIELDS_AND_IDS;
        return !errorResultTypeHasIds || (id && errorResult.ids.includes(id));
      })
      .map((errorResult) => errorResult.message)
      .find(alwaysTrue);
  };
};
