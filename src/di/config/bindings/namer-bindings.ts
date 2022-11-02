import { Container, injected } from 'brandi';
import { DefaultActionNamer } from '../../../core/namers/action-default-namer';
import { ActionWizardNamer } from '../../../core/namers/action-wizard-namer';
import { DefaultCommandNamer } from '../../../core/namers/command-default-namer';
import { CommandWizardNamer } from '../../../core/namers/command-wizard-namer';
import { DefaultContextNamer } from '../../../core/namers/context-default-namer';
import { DefaultSpecNamer } from '../../../core/namers/spec-default-namer';
import { SpecWizardNamer } from '../../../core/namers/spec-wizard-namer';
import { DefaultVariableNamer } from '../../../core/namers/variable-default-namer';
import { Tokens } from '../brandi-tokens';

export const bindNamers = (container: Container): void => {
  // action default namer
  container
    .bind(Tokens.DefaultNamer_Action)
    .toInstance(DefaultActionNamer)
    .inSingletonScope();
  // command default namer
  container
    .bind(Tokens.DefaultNamer_Command)
    .toInstance(DefaultCommandNamer)
    .inSingletonScope();
  // context default namer
  container
    .bind(Tokens.DefaultNamer_Context)
    .toInstance(DefaultContextNamer)
    .inSingletonScope();
  // spec default namer
  container
    .bind(Tokens.DefaultNamer_Spec)
    .toInstance(DefaultSpecNamer)
    .inSingletonScope();
  // variable default namer
  container
    .bind(Tokens.DefaultNamer_Variable)
    .toInstance(DefaultVariableNamer)
    .inSingletonScope();
  // action wizard namer
  container
    .bind(Tokens.WizardNamer_Action)
    .toInstance(ActionWizardNamer)
    .inSingletonScope();
  injected(ActionWizardNamer, Tokens.DefaultNamer_Action);
  // command wizard namer
  container
    .bind(Tokens.WizardNamer_Command)
    .toInstance(CommandWizardNamer)
    .inSingletonScope();
  injected(CommandWizardNamer, Tokens.DefaultNamer_Command);
  // spec wizard namer
  container
    .bind(Tokens.WizardNamer_Spec)
    .toInstance(SpecWizardNamer)
    .inSingletonScope();
  injected(SpecWizardNamer, Tokens.DefaultNamer_Spec);
};
