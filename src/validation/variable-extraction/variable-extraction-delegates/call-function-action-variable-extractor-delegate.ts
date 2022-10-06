import { isCallFunctionAction } from '../../../data/model/action/call-function/call-function';
import { NotImplementedError } from '../../../error/not-implemented-error';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getCallFunctionVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isCallFunctionAction(action)) {
        throw new NotImplementedError('CallFunctionVariableExtractorDelegate');
      }
      return undefined;
    },
  });
