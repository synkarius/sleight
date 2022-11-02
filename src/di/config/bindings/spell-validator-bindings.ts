import { Container, injected } from 'brandi';
import { ClickSpellMapper } from '../../../core/mappers/spell/mc-spell-mapper';
import { KeyPressSpellMapper } from '../../../core/mappers/spell/sk-spell-mapper';
import { TextSpellMapper } from '../../../core/mappers/spell/st-spell-mapper';
import { ClickSpellActionValidator } from '../../../core/validators/spell/mc-spell-action-validator';
import { ClickSpellCommandValidator } from '../../../core/validators/spell/mc-spell-command-validator';
import { ClickSpellSpecValidator } from '../../../core/validators/spell/mc-spell-spec-validator';
import { KeyPressSpellActionValidator } from '../../../core/validators/spell/sk-spell-action-validator';
import { KeyPressSpellCommandValidator } from '../../../core/validators/spell/sk-spell-command-validator';
import { KeyPressSpellSpecValidator } from '../../../core/validators/spell/sk-spell-spec-validator';
import { TextSpellActionValidator } from '../../../core/validators/spell/st-spell-action-validator';
import { TextSpellCommandValidator } from '../../../core/validators/spell/st-spell-command-validator';
import { TextSpellSpecValidator } from '../../../core/validators/spell/st-spell-spec-validator';
import { Tokens } from '../brandi-tokens';

export const bindSpellValidators = (container: Container): void => {
  bindSpellMappers(container);
  // keypress spell
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
  // text spell
  container
    .bind(Tokens.TextSpellSpecValidator)
    .toInstance(TextSpellSpecValidator)
    .inSingletonScope();
  injected(
    TextSpellSpecValidator,
    Tokens.TextSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.SpecCompositeValidator
  );
  container
    .bind(Tokens.TextSpellActionValidator)
    .toInstance(TextSpellActionValidator)
    .inSingletonScope();
  injected(
    TextSpellActionValidator,
    Tokens.TextSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.ActionCompositeValidator
  );
  container
    .bind(Tokens.TextSpellCommandValidator)
    .toInstance(TextSpellCommandValidator)
    .inSingletonScope();
  injected(
    TextSpellCommandValidator,
    Tokens.TextSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.CommandCompositeValidator
  );
  // click spell
  container
    .bind(Tokens.ClickSpellSpecValidator)
    .toInstance(ClickSpellSpecValidator)
    .inSingletonScope();
  injected(
    ClickSpellSpecValidator,
    Tokens.ClickSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.SpecCompositeValidator
  );
  container
    .bind(Tokens.ClickSpellActionValidator)
    .toInstance(ClickSpellActionValidator)
    .inSingletonScope();
  injected(
    ClickSpellActionValidator,
    Tokens.ClickSpellMapper,
    Tokens.SleightDataMerger,
    Tokens.ActionCompositeValidator
  );
  container
    .bind(Tokens.ClickSpellCommandValidator)
    .toInstance(ClickSpellCommandValidator)
    .inSingletonScope();
  injected(
    ClickSpellCommandValidator,
    Tokens.ClickSpellMapper,
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
    Tokens.DomainMapper_Selector,
    Tokens.WizardNamer_Action,
    Tokens.WizardNamer_Command,
    Tokens.WizardNamer_Spec
  );
  container
    .bind(Tokens.TextSpellMapper)
    .toInstance(TextSpellMapper)
    .inSingletonScope();
  injected(
    TextSpellMapper,
    Tokens.DomainMapper_Action,
    Tokens.DomainMapper_Command,
    Tokens.DomainMapper_Spec,
    Tokens.DomainMapper_Selector,
    Tokens.WizardNamer_Action,
    Tokens.WizardNamer_Command,
    Tokens.WizardNamer_Spec
  );
  container
    .bind(Tokens.ClickSpellMapper)
    .toInstance(ClickSpellMapper)
    .inSingletonScope();
  injected(
    ClickSpellMapper,
    Tokens.DomainMapper_Action,
    Tokens.DomainMapper_Command,
    Tokens.DomainMapper_Spec,
    Tokens.DomainMapper_Selector,
    Tokens.WizardNamer_Action,
    Tokens.WizardNamer_Command,
    Tokens.WizardNamer_Spec
  );
};
