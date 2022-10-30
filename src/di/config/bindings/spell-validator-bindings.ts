import { Container, injected } from 'brandi';
import { KeyPressSpellMapper } from '../../../core/mappers/spell/sk-spell-mapper';
import { KeyPressSpellActionValidator } from '../../../core/validators/spell/sk-spell-action-validator';
import { KeyPressSpellCommandValidator } from '../../../core/validators/spell/sk-spell-command-validator';
import { KeyPressSpellSpecValidator } from '../../../core/validators/spell/sk-spell-spec-validator';
import { Tokens } from '../brandi-tokens';

export const bindSpellValidators = (container: Container): void => {
  bindSpellMappers(container);
  //
  container
    .bind(Tokens.KeyPressSpellSpecValidator)
    .toInstance(KeyPressSpellSpecValidator)
    .inSingletonScope();
  injected(
    KeyPressSpellSpecValidator,
    Tokens.KeyPressSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.SpecCompositeValidator
  );
  container
    .bind(Tokens.KeyPressSpellActionValidator)
    .toInstance(KeyPressSpellActionValidator)
    .inSingletonScope();
  injected(
    KeyPressSpellActionValidator,
    Tokens.KeyPressSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.ActionCompositeValidator
  );
  container
    .bind(Tokens.KeyPressSpellCommandValidator)
    .toInstance(KeyPressSpellCommandValidator)
    .inSingletonScope();
  injected(
    KeyPressSpellCommandValidator,
    Tokens.KeyPressSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.CommandCompositeValidator
  );
};

const bindSpellMappers = (container: Container): void => {
  container
    .bind(Tokens.KeyPressSpellMapper)
    .toInstance(KeyPressSpellMapper)
    .inSingletonScope();
  injected(
    KeyPressSpellMapper,
    Tokens.DomainMapper_Action,
    Tokens.DomainMapper_Command,
    Tokens.DomainMapper_Spec,
    Tokens.DomainMapper_Selector
  );
};
