import { VariableType } from '../../../data/model/variable/variable-types';
import { Field } from '../../../validation/validation-field';

interface AbstractActionFieldGroup {
  readonly type: VariableType.Type;
  readonly radio: Field;
  readonly value: Field;
  readonly variable: Field;
}

interface TextActionFieldGroup extends AbstractActionFieldGroup {
  type: typeof VariableType.Enum.TEXT;
}

export const isTextActionFieldGroup = (
  group: ActionValueFieldGroup
): group is TextActionFieldGroup => group.type === VariableType.Enum.TEXT;

interface NumericActionFieldGroup extends AbstractActionFieldGroup {
  type: typeof VariableType.Enum.NUMBER;
  min?: number;
  max?: number;
}

export const isNumericActionFieldGroup = (
  group: ActionValueFieldGroup
): group is NumericActionFieldGroup => group.type === VariableType.Enum.NUMBER;

interface EnumActionFieldGroup extends AbstractActionFieldGroup {
  type: typeof VariableType.Enum.ENUM;
  enumValues: string[];
}

export const isEnumActionFieldGroup = (
  group: ActionValueFieldGroup
): group is EnumActionFieldGroup => group.type === VariableType.Enum.ENUM;

/** Provides declarative info about a field group. */
export type ActionValueFieldGroup =
  | TextActionFieldGroup
  | NumericActionFieldGroup
  | EnumActionFieldGroup;

/** Should use this instead of Object.values(group).includes(field) because
 * values are not all fields and some are numeric.
 */
export const groupIncludesField = (
  group: ActionValueFieldGroup,
  field: Field
): boolean =>
  group.radio === field || group.value === field || group.variable === field;
