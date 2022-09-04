import { alwaysTrue, isDefined, notFalsy } from '../common/common-functions';
import { Field } from './validation-field';
import {
  ErrorValidationResult,
  ValidationResultType,
} from './validation-result';

type GetErrorMessageFn = (fields: Field[], id?: string) => string | undefined;

/**
 * Convenience method to get the singular error message for one or more fields.
 * @param errorResults
 * @returns
 */
export const processErrorResults = (
  errorResults: ErrorValidationResult[]
): GetErrorMessageFn => {
  const errorMap = new Map<Field, ErrorValidationResult>();
  for (const errorResult of errorResults) {
    const fields =
      errorResult.type === ValidationResultType.MULTI_FIELD
        ? errorResult.errorHighlightFields
        : [errorResult.field];
    for (const field of fields) {
      errorMap.set(field, errorResult);
    }
  }
  return (fields: Field[], id?: string) => {
    return fields
      .map((field) => errorMap.get(field))
      .filter(isDefined)
      .filter((errorResult) => {
        // if the error result is an ID_LIST type, also match on id
        return (
          !(
            errorResult.type === ValidationResultType.ID_LIST ||
            errorResult.type === ValidationResultType.MULTI_FIELD
          ) ||
          (id && errorResult.ids.includes(id))
        );
      })
      .map((errorResult) => errorResult.message)
      .find(alwaysTrue);
  };
};
