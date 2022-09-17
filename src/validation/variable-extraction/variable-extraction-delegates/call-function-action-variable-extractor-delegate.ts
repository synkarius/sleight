import { isCallFunctionAction } from '../../../data/model/action/call-function/call-function';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getCallFunctionVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isCallFunctionAction(action)) {
        // TODO: figure out how to do this
        return [];
      }
    },
  });
