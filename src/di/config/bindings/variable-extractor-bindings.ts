import { Container, injected } from 'brandi';
import { DelegatingVariableExtractor } from '../../../validation/variable-extraction/delegating-variable-extractor';
import { getVariableExtractionDelegates } from '../../../validation/variable-extraction/variable-extraction-delegates/variable-extraction-delegates';
import { Tokens } from '../brandi-tokens';

export const bindVariableExtractor = (container: Container): void => {
  // variable extractor delegates
  container
    .bind(Tokens.VariableExtractorDelegates)
    .toConstant(getVariableExtractionDelegates());
  // variable extractor
  container
    .bind(Tokens.VariableExtractor)
    .toInstance(DelegatingVariableExtractor)
    .inSingletonScope();
  injected(DelegatingVariableExtractor, Tokens.VariableExtractorDelegates);
};
