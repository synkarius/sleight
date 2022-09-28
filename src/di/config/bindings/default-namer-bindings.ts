import { Container } from 'brandi';
import { DefaultActionNamer } from '../../../core/default-namers/action-default-namer';
import { DefaultCommandNamer } from '../../../core/default-namers/command-default-namer';
import { DefaultContextNamer } from '../../../core/default-namers/context-default-namer';
import { DefaultSpecNamer } from '../../../core/default-namers/spec-default-namer';
import { DefaultVariableNamer } from '../../../core/default-namers/variable-default-namer';
import { Tokens } from '../brandi-tokens';

export const bindDefaultNamers = (container: Container): void => {
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
};
