import { Action } from '../../data/model/action/action';
import { ExtractedActionValue } from './variable-extractor';

export type VariableExtractorDelegate = {
  extractActionValues: (action: Action) => ExtractedActionValue[] | undefined;
};
