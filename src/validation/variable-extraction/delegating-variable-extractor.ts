import { isDefined } from '../../core/common/common-functions';
import { Action } from '../../data/model/action/action';
import { ActionValueType } from '../../data/model/action/action-value-type';
import { MissingDelegateError } from '../../error/missing-delegate-error';
import { ExtractedVariable, VariableExtractor } from './variable-extractor';
import { VariableExtractorDelegate } from './variable-extractor-delegate';

export class DelegatingVariableExtractor implements VariableExtractor {
  constructor(private delegates: VariableExtractorDelegate[]) {}

  extractVariables(action: Action): ExtractedVariable[] {
    const extracted = this.delegates
      .map((delegate) => delegate.extractActionValues(action))
      .filter(isDefined);
    if (!extracted.length) {
      /* A delegate for an action type which has no variables
       * should return an empty array.
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
  }
}
