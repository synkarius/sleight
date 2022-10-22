import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getCallFunctionActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isCallFunctionAction(action)) {
        return {
          ...action,
          parameters: action.parameters.map((param) =>
            maybeRewriteVariableId(param, oldId, newId)
          ),
        };
      }
    },
    isApplicable: isCallFunctionAction,
  });
