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
  ContextIdRewriterArray,
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

export const bindIdRewriters = (container: Container): void => {
  // action id rewriter
  container
    .bind(Tokens.ActionIdRewriter)
    .toInstance(ActionIdRewriter)
    .inSingletonScope();
  // action ids (in command) rewriter
  container
    .bind(Tokens.ActionIdWithinCommandsRewriter)
    .toInstance(ActionIdWithinCommandsRewriter)
    .inSingletonScope();
  //
  container
    .bind(Tokens.ActionIdRewriterArray)
    .toInstance(ActionIdRewriterArray)
    .inSingletonScope();
  injected(
    ActionIdRewriterArray,
    Tokens.ActionIdRewriter,
    Tokens.ActionIdWithinCommandsRewriter
  );
  // command id rewriter
  container
    .bind(Tokens.CommandIdRewriter)
    .toInstance(CommandIdRewriter)
    .inSingletonScope();
  // context id rewriter
  container
    .bind(Tokens.ContextIdRewriter)
    .toInstance(ContextIdRewriter)
    .inSingletonScope();
  // context ids (in commands) rewriter
  container
    .bind(Tokens.ContextIdWithinCommandsRewriter)
    .toInstance(ContextIdWithinCommandsRewriter)
    .inSingletonScope();
  //
  container
    .bind(Tokens.ContextIdRewriterArray)
    .toInstance(ContextIdRewriterArray)
    .inSingletonScope();
  // selector id rewriter
  container
    .bind(Tokens.SelectorIdRewriter)
    .toInstance(SelectorIdRewriter)
    .inSingletonScope();
  // selector ids (within specs) rewriter
  container
    .bind(Tokens.SelectorIdWithinSpecsRewriter)
    .toInstance(SelectorIdWithinSpecsIdRewriter)
    .inSingletonScope();
  // selector ids (within variables) rewriter
  container
    .bind(Tokens.SelectorIdWithinVariablesRewriter)
    .toInstance(SelectorIdWithinVariablesIdRewriter)
    .inSingletonScope();
  //
  container
    .bind(Tokens.SelectorIdRewriterArray)
    .toInstance(SelectorIdRewriterArray)
    .inSingletonScope();
  // spec id rewriter
  container
    .bind(Tokens.SpecIdRewriter)
    .toInstance(SpecIdRewriter)
    .inSingletonScope();
  // spec ids (within commands) rewriter
  container
    .bind(Tokens.SpecIdWithinCommandsRewriter)
    .toInstance(SpecIdWithinCommandsRewriter)
    .inSingletonScope();
  //
  container
    .bind(Tokens.SpecIdRewriterArray)
    .toInstance(SpecIdRewriterArray)
    .inSingletonScope();
  // variable id rewriter
  container
    .bind(Tokens.VariableIdRewriter)
    .toInstance(VariableIdRewriter)
    .inSingletonScope();
  // variable ids (in action) rewriter
  container
    .bind(Tokens.VariableIdWithinActionsRewriter)
    .toInstance(VariableIdWithinActionsRewriter)
    .inSingletonScope();
  // variable ids (in specs) rewriter
  container
    .bind(Tokens.VariableIdWithinSpecsRewriter)
    .toInstance(VariableIdWithinSpecsRewriter)
    .inSingletonScope();
  //
  container
    .bind(Tokens.VariableIdRewriterArray)
    .toInstance(VariableIdRewriterArray)
    .inSingletonScope();
};
