import { isDefined } from '../../core/common/common-functions';
import { ActionValueType } from '../../data/model/action/action-value-type';
import { MissingDelegateError } from '../../error/missing-delegate-error';
import { getVariableExtractionDelegates } from './variable-extraction-delegates/variable-extraction-delegates';
import { ExtractedVariable, VariableExtractor } from './variable-extractor';

export const getDelegatingVariableExtractor = (): VariableExtractor => {
  const delegates = getVariableExtractionDelegates();
  return {
    extractVariables: (action) => {
      const extracted = delegates
        .map((delegate) => delegate.extractVariables(action))
        .filter(isDefined);
      if (!extracted.length) {
        /** It could turn out that there is a future action type which has no
         * variables; the delegate for such an action type should return an
         * empty array.
         */
        const errorMessage = 'variable extractor for: ' + action.type;
        throw new MissingDelegateError(errorMessage);
      }
      return extracted
        .flat()
        .map((ev) => ({ ...ev, actionId: action.id }))
        .filter(
          (ev): ev is ExtractedVariable =>
            ev.actionValueType === ActionValueType.Enum.USE_VARIABLE
        );
    },
  };
};
