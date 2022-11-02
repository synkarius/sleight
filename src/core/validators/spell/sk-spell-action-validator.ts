import { SleightDataMerger } from '../../../data/imports/data-merger';
import { KeyPressSpell } from '../../../data/wizard/spell';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { SpellMapper } from '../../mappers/spell/spell-mapper';
import { AbstractSpellValidator } from './abstract-spell-validator';
import { Action } from '../../../data/model/action/action';
import { SingleItemCompositeValidator } from '../../../data/composite-validators/single-item/single-item-composite-validator';
import { SpellData } from '../../mappers/spell/spell-data';
import { SleightDataInternalFormat } from '../../../data/data-formats';
import { CompositeValidationResult } from '../../../data/composite-validators/composite-validation-result';

export class KeyPressSpellActionValidator extends AbstractSpellValidator<
  KeyPressSpell,
  Action
> {
  constructor(
    spellMapper: SpellMapper<KeyPressSpell>,
    sleightDataMerger: SleightDataMerger,
    actionValidator: SingleItemCompositeValidator<Action>
  ) {
    super(
      spellMapper,
      sleightDataMerger,
      actionValidator,
      Field.WIZ_SK_KEY,
      ValidationErrorCode.WIZ_AC_INVALID
    );
  }

  getSICValidationResult(
    spellData: SpellData,
    merged: SleightDataInternalFormat
  ): CompositeValidationResult {
    return this.sicValidator.validateSingle(spellData.action, merged);
  }
}
