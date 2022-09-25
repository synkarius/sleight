import { isWaitForWindowAction } from '../../../../model/action/wait-for-window/wait-for-window';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getWaitForWindowActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isWaitForWindowAction(action)) {
        return {
          ...action,
          executable: maybeRewriteVariableId(action.executable, oldId, newId),
          title: maybeRewriteVariableId(action.title, oldId, newId),
          waitSeconds: maybeRewriteVariableId(action.waitSeconds, oldId, newId),
        };
      }
    },
  });
