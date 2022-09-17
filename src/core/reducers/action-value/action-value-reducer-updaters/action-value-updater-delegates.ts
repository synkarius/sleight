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

export const getActionValueUpdaterDelegates: () => ActionValueUpdaterDelegate[] =
  () => [
    // mouse action
    getMMouseMoveXActionValueUpdaterDelegate(),
    getMMouseMoveYActionValueUpdaterDelegate(),
    getMcMouseKeyActionValueUpdaterDelegate(),
    getMcMhrPauseActionValueUpdaterDelegate(),
    getMcRepeatActionValueUpdaterDelegate(),
    getMhrDirectionActionValueUpdaterDelegate(),
    // pause action
    getPCentisecondsActionValueUpdaterDelegate(),
    // send-key action
    getSkKeyToSendActionValueUpdaterDelegate(),
    getSkOuterPauseActionValueUpdaterDelegate(),
    getSkInnerPauseActionValueUpdaterDelegate(),
    getSkRepeatActionValueUpdaterDelegate(),
    getSkDirectionActionValueUpdaterDelegate(),
  ];
