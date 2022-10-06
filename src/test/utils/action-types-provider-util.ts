import { ActionType } from '../../data/model/action/action-types';
import { createBringAppAction } from '../../data/model/action/bring-app/bring-app';
import { createCallFunctionAction } from '../../data/model/action/call-function/call-function';
import { createMimicAction } from '../../data/model/action/mimic/mimic';
import {
  createMouseClickAction,
  createMouseHoldAction,
  createMouseMoveAction,
} from '../../data/model/action/mouse/mouse';
import { createPauseAction } from '../../data/model/action/pause/pause';
import {
  createSendKeyHoldReleaseAction,
  createSendKeyPressAction,
} from '../../data/model/action/send-key/send-key';
import { createSendTextAction } from '../../data/model/action/send-text/send-text';
import { createWaitForWindowAction } from '../../data/model/action/wait-for-window/wait-for-window';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';

/*
 * This util could be better. It does guarantee that all action types
 * are covered, but it doesn't guarantee that subtypes are covered.
 */
export const getTestActionsForAllActionTypes = () => {
  return ActionType.values()
    .map((actionType) => {
      switch (actionType) {
        case ActionType.Enum.BRING_APP:
          return [createBringAppAction()];
        case ActionType.Enum.CALL_FUNCTION:
          return [createCallFunctionAction()];
        case ActionType.Enum.MIMIC:
          return [createMimicAction()];
        case ActionType.Enum.MOUSE:
          return [
            createMouseMoveAction(),
            createMouseClickAction(),
            createMouseHoldAction(),
          ];
        case ActionType.Enum.PAUSE:
          return [createPauseAction()];
        case ActionType.Enum.SEND_KEY:
          return [createSendKeyPressAction(), createSendKeyHoldReleaseAction()];
        case ActionType.Enum.SEND_TEXT:
          return [createSendTextAction()];
        case ActionType.Enum.WAIT_FOR_WINDOW:
          return [createWaitForWindowAction()];
        default:
          throw new ExhaustivenessFailureError(actionType);
      }
    })
    .flat();
};
