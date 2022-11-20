import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';
import { Field } from '../../validation/validation-field';
import { isNone } from './maybe';

describe('field groups supplier tests', () => {
  const fieldGroupsSupplier = container.get(Tokens.FieldGroupsSupplier);

  it('should include all field groups found by naming convention', () => {
    const allActionValueFields = Object.keys(Field)
      .filter((i) => !isNaN(Number(i)))
      .map((field) => +field)
      .filter((field) => {
        const fieldName = Field[field];
        const prefix = fieldName.startsWith('AC_');
        const suffix =
          fieldName.endsWith('_RADIO') ||
          fieldName.endsWith('_VALUE') ||
          fieldName.endsWith('_VAR');
        return prefix && suffix;
      });

    const missing = allActionValueFields
      .map((field) => ({
        name: Field[field],
        metadata: fieldGroupsSupplier.getGroupByField(field),
      }))
      .filter((result) => isNone(result.metadata))
      .map((result) => result.name)
      .join(', ');

    expect(missing).toBeFalsy();
  });
});
