import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { isSendKeyAction } from '../../../../model/action/send-key/send-key';
import { SendKeyMode } from '../../../../model/action/send-key/send-key-modes';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getSendKeyActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isSendKeyAction(action)) {
        const sendKeyMode = action.sendKeyMode;
        const mrid = maybeRewriteVariableId;
        switch (sendKeyMode) {
          case SendKeyMode.Enum.PRESS:
            return {
              ...action,
              keyToSend: mrid(action.keyToSend, oldId, newId),
              outerPause: mrid(action.outerPause, oldId, newId),
              innerPause: mrid(action.innerPause, oldId, newId),
              repeat: mrid(action.repeat, oldId, newId),
            };
          case SendKeyMode.Enum.HOLD_RELEASE:
            return {
              ...action,
              keyToSend: mrid(action.keyToSend, oldId, newId),
              outerPause: mrid(action.outerPause, oldId, newId),
              direction: mrid(action.direction, oldId, newId),
            };
          default:
            throw new ExhaustivenessFailureError(sendKeyMode);
        }
      }
    },
  });
