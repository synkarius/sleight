import { Container, injected } from 'brandi';
import { ActionIdRewriter } from '../../../data/imports/model-update/id-rewriter/action-id-rewriter';
import { VariableIdWithinActionsRewriter } from '../../../data/imports/model-update/id-rewriter/variable-id-within-actions-rewriter';
import { ActionIdWithinCommandsRewriter } from '../../../data/imports/model-update/id-rewriter/action-id-within-commands-rewriter';
import { CommandIdRewriter } from '../../../data/imports/model-update/id-rewriter/command-id-rewriter';
import { ContextIdRewriter } from '../../../data/imports/model-update/id-rewriter/context-id-rewriter';
import { SelectorIdRewriter } from '../../../data/imports/model-update/id-rewriter/selector-id-rewriter';
import { SpecIdRewriter } from '../../../data/imports/model-update/id-rewriter/spec-id-rewriter';
import { VariableIdRewriter } from '../../../data/imports/model-update/id-rewriter/variable-id-rewriter';
import {
  ActionIdRewriterArray,
  CommandIdRewriterArray,
  ContextIdRewriterArray,
  FnIdRewriterArray,
  SelectorIdRewriterArray,
  SpecIdRewriterArray,
  VariableIdRewriterArray,
} from '../../di-collection-types';
import { ContextIdWithinCommandsRewriter } from '../../../data/imports/model-update/id-rewriter/context-id-within-commands-rewriter';
import { SelectorIdWithinSpecsIdRewriter } from '../../../data/imports/model-update/id-rewriter/selector-id-within-specs-rewriter';
import { SelectorIdWithinVariablesIdRewriter } from '../../../data/imports/model-update/id-rewriter/selector-id-within-variables-rewriter';
import { SpecIdWithinCommandsRewriter } from '../../../data/imports/model-update/id-rewriter/spec-id-within-commands-rewriter';
import { VariableIdWithinSpecsRewriter } from '../../../data/imports/model-update/id-rewriter/variable-id-within-specs-rewriter';
import { Tokens } from '../brandi-tokens';
import { getBringAppActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/bring-app-action-variable-ids-rewriter-delegate';
import { getCallFunctionActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/call-function-action-variable-ids-rewriter-delegate';
import { getMimicActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/mimic-action-variable-ids-rewriter-delegate';
import { getMouseActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/mouse-action-variable-ids-rewriter-delegate';
import { getPauseActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/pause-action-variable-ids-rewriter-delegate';
import { getSendKeyActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/send-key-action-variable-ids-rewriter-delegate';
import { getSendTextActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/send-text-action-variable-ids-rewriter-delegate';
import { getWaitForWindowActionVariableIdsRewriterDelegate } from '../../../data/imports/model-update/id-rewriter/action-variable-ids-rewriter-delegate/wait-for-window-action-variable-ids-rewriter-delegate';
import { FnIdRewriter } from '../../../data/imports/model-update/id-rewriter/fn-id-rewriter';
import { FnIdWithinActionsRewriter } from '../../../data/imports/model-update/id-rewriter/fn-id-within-actions-rewriter';

export const bindIdRewriters = (container: Container): void => {
  /*
   * ACTION ID REWRITERS
   */
  container
    .bind(Tokens.ActionIdRewriter)
    .toInstance(ActionIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.ActionIdWithinCommandsRewriter)
    .toInstance(ActionIdWithinCommandsRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.ActionIdRewriterArray)
    .toInstance(ActionIdRewriterArray)
    .inSingletonScope();
  injected(
    ActionIdRewriterArray,
    Tokens.ActionIdRewriter,
    Tokens.ActionIdWithinCommandsRewriter
  );
  /*
   * COMMAND ID REWRITERS
   */
  container
    .bind(Tokens.CommandIdRewriter)
    .toInstance(CommandIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.CommandIdRewriterArray)
    .toInstance(CommandIdRewriterArray)
    .inSingletonScope();
  injected(CommandIdRewriterArray, Tokens.CommandIdRewriter);
  /*
   * CONTEXT ID REWRITERS
   */
  container
    .bind(Tokens.ContextIdRewriter)
    .toInstance(ContextIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.ContextIdWithinCommandsRewriter)
    .toInstance(ContextIdWithinCommandsRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.ContextIdRewriterArray)
    .toInstance(ContextIdRewriterArray)
    .inSingletonScope();
  injected(
    ContextIdRewriterArray,
    Tokens.ContextIdRewriter,
    Tokens.ContextIdWithinCommandsRewriter
  );
  /*
   * FN ID REWRITERS
   */
  container
    .bind(Tokens.FnIdRewriter)
    .toInstance(FnIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.FnIdWithinActionsRewriter)
    .toInstance(FnIdWithinActionsRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.FnIdRewriterArray)
    .toInstance(FnIdRewriterArray)
    .inSingletonScope();
  injected(
    FnIdRewriterArray,
    Tokens.FnIdRewriter,
    Tokens.FnIdWithinActionsRewriter
  );
  /*
   * SELECTOR ID REWRITERS
   */
  container
    .bind(Tokens.SelectorIdRewriter)
    .toInstance(SelectorIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.SelectorIdWithinSpecsRewriter)
    .toInstance(SelectorIdWithinSpecsIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.SelectorIdWithinVariablesRewriter)
    .toInstance(SelectorIdWithinVariablesIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.SelectorIdRewriterArray)
    .toInstance(SelectorIdRewriterArray)
    .inSingletonScope();
  injected(
    SelectorIdRewriterArray,
    Tokens.SelectorIdRewriter,
    Tokens.SelectorIdWithinSpecsRewriter,
    Tokens.SelectorIdWithinVariablesRewriter
  );
  /*
   * SPEC ID REWRITERS
   */
  container
    .bind(Tokens.SpecIdRewriter)
    .toInstance(SpecIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.SpecIdWithinCommandsRewriter)
    .toInstance(SpecIdWithinCommandsRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.SpecIdRewriterArray)
    .toInstance(SpecIdRewriterArray)
    .inSingletonScope();
  injected(
    SpecIdRewriterArray,
    Tokens.SpecIdRewriter,
    Tokens.SpecIdWithinCommandsRewriter
  );
  /*
   * VARIABLE ID REWRITERS
   */
  container
    .bind(Tokens.VariableIdRewriter)
    .toInstance(VariableIdRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.ActionVariableIdsRewriterDelegates)
    .toConstant([
      getBringAppActionVariableIdsRewriterDelegate(),
      getCallFunctionActionVariableIdsRewriterDelegate(),
      getMimicActionVariableIdsRewriterDelegate(),
      getMouseActionVariableIdsRewriterDelegate(),
      getPauseActionVariableIdsRewriterDelegate(),
      getSendKeyActionVariableIdsRewriterDelegate(),
      getSendTextActionVariableIdsRewriterDelegate(),
      getWaitForWindowActionVariableIdsRewriterDelegate(),
    ]);
  container
    .bind(Tokens.VariableIdWithinActionsRewriter)
    .toInstance(VariableIdWithinActionsRewriter)
    .inSingletonScope();
  injected(
    VariableIdWithinActionsRewriter,
    Tokens.ActionVariableIdsRewriterDelegates
  );
  container
    .bind(Tokens.VariableIdWithinSpecsRewriter)
    .toInstance(VariableIdWithinSpecsRewriter)
    .inSingletonScope();
  container
    .bind(Tokens.VariableIdRewriterArray)
    .toInstance(VariableIdRewriterArray)
    .inSingletonScope();
  injected(
    VariableIdRewriterArray,
    Tokens.VariableIdRewriter,
    Tokens.VariableIdWithinActionsRewriter,
    Tokens.VariableIdWithinSpecsRewriter
  );
};
