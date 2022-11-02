import { SleightDataMerger } from '../../../data/imports/data-merger';
import { TextSpell } from '../../../data/wizard/spell';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { SpellMapper } from '../../mappers/spell/spell-mapper';
import { AbstractSpellValidator } from './abstract-spell-validator';
import { SpellData } from '../../mappers/spell/spell-data';
import { SleightDataInternalFormat } from '../../../data/data-formats';
import { CompositeValidationResult } from '../../../data/composite-validators/composite-validation-result';
import { SingleItemCompositeValidator } from '../../../data/composite-validators/single-item/single-item-composite-validator';
import { Command } from '../../../data/model/command/command';

export class TextSpellCommandValidator extends AbstractSpellValidator<
  TextSpell,
  Command
> {
  constructor(
    spellMapper: SpellMapper<TextSpell>,
    sleightDataMerger: SleightDataMerger,
    commandValidator: SingleItemCompositeValidator<Command>
  ) {
    super(
      spellMapper,
      sleightDataMerger,
      commandValidator,
      Field.WIZ_ST_CONTEXT,
      ValidationErrorCode.WIZ_CTX_INVALID
    );
  }

  getSICValidationResult(
    spellData: SpellData,
    merged: SleightDataInternalFormat
  ): CompositeValidationResult {
    return this.sicValidator.validateSingle(spellData.command, merged);
  }
}
