import { Container, injected } from 'brandi';
import { getMcMouseButtonActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/mcmhr-mouse-button-action-value-updater-delegate';
import { getMcMhrPauseActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/mcmhr-pause-action-value-updater-delegate';
import { getMcRepeatActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/mc-repeat-action-value-updater-delegate';
import { getPCentisecondsActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/p-centiseconds-action-value-updater-delegate';
import { getSkDirectionActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/sk-direction-action-value-updater-delegate';
import { getSkInnerPauseActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/sk-inner-pause-action-value-updater-delegate';
import { getSkKeyToSendActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/sk-key-to-send-action-value-updater-delegate';
import { getSkOuterPauseActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/sk-outer-pause-action-value-updater-delegate';
import { getSkRepeatActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/sk-repeat-action-value-updater-delegate';
import { getMhrDirectionActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/mhr-direction-action-value-updater-delegate';
import { getMMouseMoveYActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/mm-move-y-action-value-updater-delegate';
import { getMMouseMoveXActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/mm-move-x-action-value-updater-delegate';
import { getWfwExecutableActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/wfw-executable-action-value-updater-delegate';
import { getWfwTitleActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/wfw-title-action-value-updater-delegate';
import { getWfwWaitSecondsActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/wfw-wait-seconds-action-value-updater-delegate';
import { getStTextActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/st-text-action-value-updater-delegate';
import { getMimicWordsActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/mimic-words-action-value-updater-delegate';
import { getBringAppPathActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/bring-app-path-action-value-updater-delegate';
import { getBringAppTitleActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/bring-app-title-action-value-updater-delegate';
import { getBringAppStartDirActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/bring-app-start-dir-action-value-updater-delegate';
import { Tokens } from '../brandi-tokens';
import { DelegatingActionValueUpdater } from '../../../core/reducers/action-value/action-value-reducer-updaters/delegating-action-value-updater';
import { getCallFunctionActionValueUpdaterDelegate } from '../../../core/reducers/action-value/action-value-reducer-updaters/call-function-action-value-updater-delegate';

export const bindActionValueUpdater = (container: Container): void => {
  container.bind(Tokens.ActionValueUpdaterDelegates).toConstant([
    // bring app
    getBringAppPathActionValueUpdaterDelegate(),
    getBringAppTitleActionValueUpdaterDelegate(),
    getBringAppStartDirActionValueUpdaterDelegate(),
    // call function
    getCallFunctionActionValueUpdaterDelegate(),
    // mimic
    getMimicWordsActionValueUpdaterDelegate(),
    // mouse
    getMMouseMoveXActionValueUpdaterDelegate(),
    getMMouseMoveYActionValueUpdaterDelegate(),
    getMcMouseButtonActionValueUpdaterDelegate(),
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
  ]);
  container
    .bind(Tokens.ActionValueUpdater)
    .toInstance(DelegatingActionValueUpdater)
    .inSingletonScope();
  injected(DelegatingActionValueUpdater, Tokens.ActionValueUpdaterDelegates);
};
