import { ActionValueUpdaterDelegate } from './action-value-updater-delegate';
import { getCentisecondsActionValueUpdaterDelegate } from './p-centiseconds-action-value-updater-delegate';
import { getDirectionActionValueUpdaterDelegate } from './sk-direction-action-value-updater-delegate';
import { getInnerPauseActionValueUpdaterDelegate } from './sk-inner-pause-action-value-updater-delegate';
import { getKeyToSendActionValueUpdaterDelegate } from './sk-key-to-send-action-value-updater-delegate';
import { getOuterPauseActionValueUpdaterDelegate } from './sk-outer-pause-action-value-updater-delegate';
import { getRepeatActionValueUpdaterDelegate } from './sk-repeat-action-value-updater-delegate';

export const getActionValueUpdaterDelegates: () => ActionValueUpdaterDelegate[] =
  () => [
    // pause action
    getCentisecondsActionValueUpdaterDelegate(),
    // send-key action
    getKeyToSendActionValueUpdaterDelegate(),
    getOuterPauseActionValueUpdaterDelegate(),
    getInnerPauseActionValueUpdaterDelegate(),
    getRepeatActionValueUpdaterDelegate(),
    getDirectionActionValueUpdaterDelegate(),
  ];
