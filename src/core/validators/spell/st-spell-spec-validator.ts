import { SleightDataMerger } from '../../../data/imports/data-merger';
import { TextSpell } from '../../../data/wizard/spell';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import { SpellMapper } from '../../mappers/spell/spell-mapper';
import { AbstractSpellValidator } from './abstract-spell-validator';
import { Spec } from '../../../data/model/spec/spec-domain';
import { SingleItemCompositeValidator } from '../../../data/composite-validators/single-item/single-item-composite-validator';
import { CompositeValidationResult } from '../../../data/composite-validators/composite-validation-result';
import { SleightDataInternalFormat } from '../../../data/data-formats';
import { SpellData } from '../../mappers/spell/spell-data';

export class TextSpellSpecValidator extends AbstractSpellValidator<
  TextSpell,
  Spec
> {
  constructor(
    spellMapper: SpellMapper<TextSpell>,
    sleightDataMerger: SleightDataMerger,
    specValidator: SingleItemCompositeValidator<Spec>
  ) {
    super(
      spellMapper,
      sleightDataMerger,
      specValidator,
      Field.WIZ_ST_SPEC,
      ValidationErrorCode.WIZ_TXT_INVALID
    );
  }

  getSICValidationResult(
    spellData: SpellData,
    merged: SleightDataInternalFormat
  ): CompositeValidationResult {
    return this.sicValidator.validateSingle(spellData.spec, merged);
  }
}
