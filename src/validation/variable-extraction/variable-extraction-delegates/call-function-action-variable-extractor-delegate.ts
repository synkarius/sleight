import { isCallFunctionAction } from '../../../data/model/action/call-function/call-function';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getCallFunctionVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isCallFunctionAction(action)) {
        return action.parameters.map((actionValue) => ({
          ...actionValue,
          field: Field.AC_CALL_FUNC_PARAMETER_VAR,
        }));
      }
    },
  });
