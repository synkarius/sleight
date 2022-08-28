import { Field } from '../../../../validation/validation-field';

export interface ActionValueFieldGroup {
  readonly radio: Field;
  readonly value: Field;
  readonly variable: Field;
  readonly roleKey: Field;
}
