import { isBringAppAction } from '../../../../model/action/bring-app/bring-app';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getBringAppActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isBringAppAction(action)) {
        return {
          ...action,
          appPath: maybeRewriteVariableId(action.appPath, oldId, newId),
          appTitle: maybeRewriteVariableId(action.appTitle, oldId, newId),
          startDir: maybeRewriteVariableId(action.startDir, oldId, newId),
        };
      }
    },
    isApplicable: isBringAppAction,
  });
