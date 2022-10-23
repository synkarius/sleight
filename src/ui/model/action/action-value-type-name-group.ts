import { Ided } from '../../../data/model/domain';
import { VariableType } from '../../../data/model/variable/variable-types';
import { Field } from '../../../validation/validation-field';
import {
  ActionReducerActionValueChangePayloadAction,
  ActionReducerActionValueTypePayloadAction,
} from './action-editing-context';
import { ActionValueChangeIdentifierType } from './action-editing-context-support';

interface AbstractActionFieldGroup {
  readonly type: VariableType.Type;
  readonly radio: Field;
  readonly value: Field;
  readonly variable: Field;
}

interface TextActionFieldGroup extends AbstractActionFieldGroup, Partial<Ided> {
  readonly type: typeof VariableType.Enum.TEXT;
}

export const isTextActionFieldGroup = (
  group: ActionValueFieldGroup
): group is TextActionFieldGroup => group.type === VariableType.Enum.TEXT;

interface NumericActionFieldGroup
  extends AbstractActionFieldGroup,
    Partial<Ided> {
  readonly type: typeof VariableType.Enum.NUMBER;
  readonly min?: number;
  readonly max?: number;
}

export const isNumberActionFieldGroup = (
  group: ActionValueFieldGroup
): group is NumericActionFieldGroup => group.type === VariableType.Enum.NUMBER;

interface EnumActionFieldGroup extends AbstractActionFieldGroup, Partial<Ided> {
  readonly type: typeof VariableType.Enum.ENUM;
  readonly enumValues: string[];
}

export const isEnumActionFieldGroup = (
  group: ActionValueFieldGroup
): group is EnumActionFieldGroup => group.type === VariableType.Enum.ENUM;

/** Provides declarative info about a field group. */
export type ActionValueFieldGroup =
  | TextActionFieldGroup
  | NumericActionFieldGroup
  | EnumActionFieldGroup;

export const groupIncludesField = (
  group: ActionValueFieldGroup,
  action:
    | ActionReducerActionValueChangePayloadAction
    | ActionReducerActionValueTypePayloadAction
): boolean => {
  return (
    action.payload.type === ActionValueChangeIdentifierType.FIELD &&
    [group.radio, group.value, group.variable].includes(action.payload.field)
  );
};
