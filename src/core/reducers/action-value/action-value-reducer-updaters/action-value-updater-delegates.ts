import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { getMcMouseKeyActionValueUpdaterDelegate } from './mc-mouse-key-action-value-updater-delegate';
import { getMcMhrPauseActionValueUpdaterDelegate } from './mcmhr-pause-action-value-updater-delegate';
import { getMcRepeatActionValueUpdaterDelegate } from './mc-repeat-action-value-updater-delegate';
import { getPCentisecondsActionValueUpdaterDelegate } from './p-centiseconds-action-value-updater-delegate';
import { getSkDirectionActionValueUpdaterDelegate } from './sk-direction-action-value-updater-delegate';
import { getSkInnerPauseActionValueUpdaterDelegate } from './sk-inner-pause-action-value-updater-delegate';
import { getSkKeyToSendActionValueUpdaterDelegate } from './sk-key-to-send-action-value-updater-delegate';
import { getSkOuterPauseActionValueUpdaterDelegate } from './sk-outer-pause-action-value-updater-delegate';
import { getSkRepeatActionValueUpdaterDelegate } from './sk-repeat-action-value-updater-delegate';
import { getMhrDirectionActionValueUpdaterDelegate } from './mhr-direction-action-value-updater-delegate';
import { getMMouseMoveYActionValueUpdaterDelegate } from './mm-move-y-action-value-updater-delegate';
import { getMMouseMoveXActionValueUpdaterDelegate } from './mm-move-x-action-value-updater-delegate';
import { getWfwExecutableActionValueUpdaterDelegate } from './wfw-executable-action-value-reducer-delegate';
import { getWfwTitleActionValueUpdaterDelegate } from './wfw-title-action-value-reducer-delegate';
import { getWfwWaitSecondsActionValueUpdaterDelegate } from './wfw-wait-seconds-action-value-reducer-delegate';
import { getStTextActionValueUpdaterDelegate } from './st-text-action-value-reducer-delegate';
import { getMimicWordsActionValueUpdaterDelegate } from './mimic-words-action-value-reducer-delegate';
import { getBringAppPathActionValueUpdaterDelegate } from './bring-app-path-action-value-reducer-delegate';
import { getBringAppTitleActionValueUpdaterDelegate } from './bring-app-title-action-value-reducer-delegate';
import { getBringAppStartDirActionValueUpdaterDelegate } from './bring-app-start-dir-action-value-reducer-delegate';

export const getActionValueUpdaterDelegates: () => ActionValueUpdaterDelegate[] =
  () => [
    // bring app
    getBringAppPathActionValueUpdaterDelegate(),
    getBringAppTitleActionValueUpdaterDelegate(),
    getBringAppStartDirActionValueUpdaterDelegate(),
    // call function
    // TODO: call function
    // mimic
    getMimicWordsActionValueUpdaterDelegate(),
    // mouse
    getMMouseMoveXActionValueUpdaterDelegate(),
    getMMouseMoveYActionValueUpdaterDelegate(),
    getMcMouseKeyActionValueUpdaterDelegate(),
    getMcMhrPauseActionValueUpdaterDelegate(),
    getMcRepeatActionValueUpdaterDelegate(),
    getMhrDirectionActionValueUpdaterDelegate(),
    // pause
    getPCentisecondsActionValueUpdaterDelegate(),
    // send-key
    getSkKeyToSendActionValueUpdaterDelegate(),
    getSkOuterPauseActionValueUpdaterDelegate(),
    getSkInnerPauseActionValueUpdaterDelegate(),
    getSkRepeatActionValueUpdaterDelegate(),
    getSkDirectionActionValueUpdaterDelegate(),
    // send-text
    getStTextActionValueUpdaterDelegate(),
    // wait for window
    getWfwExecutableActionValueUpdaterDelegate(),
    getWfwTitleActionValueUpdaterDelegate(),
    getWfwWaitSecondsActionValueUpdaterDelegate(),
  ];
