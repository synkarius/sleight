import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { isMouseAction } from '../../../../model/action/mouse/mouse';
import { MouseActionType } from '../../../../model/action/mouse/mouse-action-type';
import {
  ActionVariableIdsRewriterDelegate,
  maybeRewriteVariableId,
} from './action-variable-ids-rewriter-delegate';

export const getMouseActionVariableIdsRewriterDelegate =
  (): ActionVariableIdsRewriterDelegate => ({
    rewriteId: (oldId, newId, action) => {
      if (isMouseAction(action)) {
        const mouseActionType = action.mouseActionType;
        switch (mouseActionType) {
          case MouseActionType.Enum.MOVE:
            return {
              ...action,
              x: maybeRewriteVariableId(action.x, oldId, newId),
              y: maybeRewriteVariableId(action.y, oldId, newId),
            };
          case MouseActionType.Enum.CLICK:
            return {
              ...action,
              mouseButton: maybeRewriteVariableId(
                action.mouseButton,
                oldId,
                newId
              ),
              pause: maybeRewriteVariableId(action.pause, oldId, newId),
              repeat: maybeRewriteVariableId(action.repeat, oldId, newId),
            };
          case MouseActionType.Enum.HOLD_RELEASE:
            return {
              ...action,
              mouseButton: maybeRewriteVariableId(
                action.mouseButton,
                oldId,
                newId
              ),
              pause: maybeRewriteVariableId(action.pause, oldId, newId),
              direction: maybeRewriteVariableId(action.direction, oldId, newId),
            };
          default:
            throw new ExhaustivenessFailureError(mouseActionType);
        }
      }
    },
    isApplicable: isMouseAction,
  });
