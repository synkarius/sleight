import { isSendTextAction } from '../../../../model/action/send-text/send-text';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getSendTextActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isSendTextAction(action)) {
        return {
          ...action,
          text: maybeRewriteVariableId(action.text, oldId, newId),
        };
      }
    },
  });
