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
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';

describe('validation support tests', () => {
  /*
   * This test could be better. It does guarantee that all action types
   * are covered, but it doesn't guarantee that subtypes are covered.
   */
  it('all actions should be covered in extract variables fn', () => {
    const injected = getDefaultInjectionContext();
    const extractor = injected.validation.variableExtractor;
    ActionType.values().forEach((actionType) => {
      switch (actionType) {
        case ActionType.Enum.BRING_APP:
          extractor.extractVariables(createBringAppAction());
          return;
        case ActionType.Enum.CALL_FUNCTION:
          extractor.extractVariables(createCallFunctionAction());
          return;
        case ActionType.Enum.MIMIC:
          extractor.extractVariables(createMimicAction());
          return;
        case ActionType.Enum.MOUSE:
          extractor.extractVariables(createMouseMoveAction());
          extractor.extractVariables(createMouseClickAction());
          extractor.extractVariables(createMouseHoldAction());
          return;
        case ActionType.Enum.PAUSE:
          extractor.extractVariables(createPauseAction());
          return;
        case ActionType.Enum.SEND_KEY:
          extractor.extractVariables(createSendKeyPressAction());
          extractor.extractVariables(createSendKeyHoldReleaseAction());
          return;
        case ActionType.Enum.SEND_TEXT:
          extractor.extractVariables(createSendTextAction());
          return;
        case ActionType.Enum.WAIT_FOR_WINDOW:
          extractor.extractVariables(createWaitForWindowAction());
          return;
        default:
          throw new ExhaustivenessFailureError(actionType);
      }
    });
  });
});
