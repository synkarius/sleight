import { ActionVariableIdsRewriterDelegate } from './action-variable-ids-rewriter-delegate';
import { getBringAppActionVariableIdsRewriterDelegate } from './bring-app-action-variable-ids-rewriter-delegate';
import { getCallFunctionActionVariableIdsRewriterDelegate } from './call-function-action-variable-ids-rewriter-delegate';
import { getMimicActionVariableIdsRewriterDelegate } from './mimic-action-variable-ids-rewriter-delegate';
import { getMouseActionVariableIdsRewriterDelegate } from './mouse-action-variable-ids-rewriter-delegate';
import { getPauseActionVariableIdsRewriterDelegate } from './pause-action-variable-ids-rewriter-delegate';
import { getSendKeyActionVariableIdsRewriterDelegate } from './send-key-action-variable-ids-rewriter-delegate';
import { getSendTextActionVariableIdsRewriterDelegate } from './send-text-action-variable-ids-rewriter-delegate';
import { getWaitForWindowActionVariableIdsRewriterDelegate } from './wait-for-window-action-variable-ids-rewriter-delegate';

export const getActionVariableIdsRewriterDelegates =
  (): ActionVariableIdsRewriterDelegate[] => [
    getBringAppActionVariableIdsRewriterDelegate(),
    getCallFunctionActionVariableIdsRewriterDelegate(),
    getMimicActionVariableIdsRewriterDelegate(),
    getMouseActionVariableIdsRewriterDelegate(),
    getPauseActionVariableIdsRewriterDelegate(),
    getSendKeyActionVariableIdsRewriterDelegate(),
    getSendTextActionVariableIdsRewriterDelegate(),
    getWaitForWindowActionVariableIdsRewriterDelegate(),
  ];
