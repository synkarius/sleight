import { isMimicAction } from '../../../../model/action/mimic/mimic';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getMimicActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isMimicAction(action)) {
        return {
          ...action,
          words: maybeRewriteVariableId(action.words, oldId, newId),
        };
      }
    },
  });
