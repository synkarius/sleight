import { Preferences } from '../../data/preferences/preferences';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import { createValidator } from '../../validation/validator-factories';
import { alwaysTrue } from '../common/common-functions';

const negativizerNotEmptyValidator: FieldValidator<Preferences> =
  createValidator(
    Field.PREFS_NEGATIVIZER,
    alwaysTrue,
    (prefs) => !!prefs.negativizer.selector.length,
    ValidationErrorCode.PREFS_NEGATIVIZER_EMPTY,
    'negativizer cannot be empty'
  );

const negativizerCharactersValidator: FieldValidator<Preferences> =
  createValidator(
    Field.PREFS_NEGATIVIZER,
    alwaysTrue,
    (prefs) => !prefs.negativizer.selector.match(/[^a-z ]/i),
    ValidationErrorCode.PREFS_NEGATIVIZER_INVALID_CHARS,
    'negativizer may only contain alphabet characters and spaces'
  );

export const getPreferencesValidators = (): FieldValidator<Preferences>[] => [
  negativizerNotEmptyValidator,
  negativizerCharactersValidator,
];
