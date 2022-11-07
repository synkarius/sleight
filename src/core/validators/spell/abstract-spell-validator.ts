import { SleightDataInternalFormat } from '../../../data/data-formats';
import { SleightDataMerger } from '../../../data/imports/data-merger';
import { Spell } from '../../../data/wizard/spell';
import {
  SingleFieldValidator,
  ValidatorType,
} from '../../../validation/field-validator';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResult,
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import {
  CompositeValidationResult,
  isInvalidCompositeValidationResult,
} from '../../../data/composite-validators/composite-validation-result';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { SpellMapper } from '../../mappers/spell/spell-mapper';
import { Validateable } from '../../../data/composite-validators/validateable';
import { SingleItemCompositeValidator } from '../../../data/composite-validators/single-item/single-item-composite-validator';
import { isSome } from '../../common/maybe';
import { SpellData } from '../../mappers/spell/spell-data';

export abstract class AbstractSpellValidator<
  S extends Spell,
  L extends Validateable
> implements SingleFieldValidator<S>
{
  validatorType: ValidatorType.FIELD;
  field: Field;
  sicValidator: SingleItemCompositeValidator<L>;
  constructor(
    private spellMapper: SpellMapper<S>,
    private sdMerger: SleightDataMerger,
    sicValidator: SingleItemCompositeValidator<L>,
    field: Field,
    private errorCode: ValidationErrorCode
  ) {
    this.validatorType = ValidatorType.FIELD;
    this.field = field;
    this.sicValidator = sicValidator;
  }
  abstract getSICValidationResult(
    spellData: SpellData,
    merged: SleightDataInternalFormat
  ): CompositeValidationResult;

  /** Override as applicable, but will probably be true most of the time. */
  isApplicable(_spell: S): boolean {
    return true;
  }

  validate(
    spell: S,
    data: Readonly<SleightDataInternalFormat>
  ): ValidationResult {
    const spellData = this.spellMapper.mapSpell(spell);
    const copyData = structuredClone(data);
    const merged = this.sdMerger.merge(spellData.data, copyData);

    const result = this.getSICValidationResult(spellData, merged);

    if (isInvalidCompositeValidationResult(result)) {
      if (!result.invalidated.length) {
        return {
          type: ValidationResultType.VALIDATION_FAILED,
          errorHighlightField: this.field,
          message: 'invalidated array is empty',
        };
      }
      return {
        type: ValidationResultType.BASIC,
        errorHighlightField: this.field,
        code: this.errorCode,
        message: result.invalidated[0].message,
      };
    }
    return validResult(this.field);
  }
}
