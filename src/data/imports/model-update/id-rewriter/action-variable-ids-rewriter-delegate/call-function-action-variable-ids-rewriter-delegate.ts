import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import { ActionVariableIdsRewriterDelegate } from './action-variable-ids-rewriter-delegate';

export const getCallFunctionActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isCallFunctionAction(action)) {
        return action;
      }
    },
  });
