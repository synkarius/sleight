import { VariableExtractorDelegate } from '../variable-extractor-delegate';
import { getBringAppVariableExtractorDelegate } from './bring-app-action-variable-extractor-delegate';
import { getCallFunctionVariableExtractorDelegate } from './call-function-action-variable-extractor-delegate';
import { getMimicVariableExtractorDelegate } from './mimic-action-variable-extractor-delegate';
import { getMouseClickVariableExtractorDelegate } from './mouse-click-action-variable-extractor-delegate';
import { getMouseHoldReleaseVariableExtractorDelegate } from './mouse-hold-release-action-variable-extractor-delegate';
import { getMouseMoveVariableExtractorDelegate } from './mouse-move-action-variable-extractor-delegate';
import { getPauseVariableExtractorDelegate } from './pause-action-variable-extractor-delegate';
import { getSendKeyHoldReleaseVariableExtractorDelegate } from './send-key-hold-release-action-variable-extractor-delegate';
import { getSendKeyPressVariableExtractorDelegate } from './send-key-press-action-variable-extractor-delegate';
import { getSendTextVariableExtractorDelegate } from './send-text-action-variable-extractor-delegate';
import { getWaitForWindowVariableExtractorDelegate } from './wait-for-window-action-variable-extractor-delegate';

export const getVariableExtractionDelegates =
  (): VariableExtractorDelegate[] => [
    // bring app
    getBringAppVariableExtractorDelegate(),
    // call function
    getCallFunctionVariableExtractorDelegate(),
    // mimic
    getMimicVariableExtractorDelegate(),
    // mouse
    getMouseClickVariableExtractorDelegate(),
    getMouseHoldReleaseVariableExtractorDelegate(),
    getMouseMoveVariableExtractorDelegate(),
    // pause
    getPauseVariableExtractorDelegate(),
    // send key
    getSendKeyPressVariableExtractorDelegate(),
    getSendKeyHoldReleaseVariableExtractorDelegate(),
    // send text
    getSendTextVariableExtractorDelegate(),
    // wait for window
    getWaitForWindowVariableExtractorDelegate(),
  ];
