import { isPauseAction } from '../../../../model/action/pause/pause';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getPauseActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isPauseAction(action)) {
        return {
          ...action,
          centiseconds: maybeRewriteVariableId(
            action.centiseconds,
            oldId,
            newId
          ),
        };
      }
    },
    isApplicable: isPauseAction,
  });
