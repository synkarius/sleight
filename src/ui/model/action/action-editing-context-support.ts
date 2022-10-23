import { isDefined } from '../../../core/common/common-functions';
import { ActionValueType } from '../../../data/model/action/action-value-type';
import { VariableType } from '../../../data/model/variable/variable-types';
import { Field } from '../../../validation/validation-field';
import { ActionValueFieldGroup } from './action-value-type-name-group';

export enum ActionValueChangeIdentifierType {
  ID,
  FIELD,
}
interface Identified {
  type:
    | ActionValueChangeIdentifierType.FIELD
    | ActionValueChangeIdentifierType.ID;
}
interface Valued {
  value: string;
}
interface OptionalDefaultValued {
  newDefaultValue?: string;
}
interface ActionValueTyped {
  actionValueType: ActionValueType.Type;
}
interface FieldIdentified extends Identified {
  type: typeof ActionValueChangeIdentifierType.FIELD;
  field: Field;
}
interface IdIdentified extends Identified {
  type: typeof ActionValueChangeIdentifierType.ID;
  id: string;
}
interface FieldedActionValueChange extends FieldIdentified, Valued {}
export const createFieldedActionValueChange = (
  field: Field,
  value: string
): FieldedActionValueChange => {
  return {
    type: ActionValueChangeIdentifierType.FIELD,
    field,
    value,
  };
};
interface IdedActionValueChange extends IdIdentified, Valued {}
export const createIdedActionValueChange = (
  id: string,
  value: string
): IdedActionValueChange => {
  return {
    type: ActionValueChangeIdentifierType.ID,
    id,
    value,
  };
};
interface FieldedActionValueChangeType
  extends FieldIdentified,
    ActionValueTyped,
    OptionalDefaultValued {}
interface IdedActionValueChangeType
  extends IdIdentified,
    ActionValueTyped,
    OptionalDefaultValued {}

export const createAVCTypeChangePayload = (
  actionValueType: ActionValueType.Type,
  group: ActionValueFieldGroup
): FieldedActionValueChangeType | IdedActionValueChangeType => {
  const base = {
    actionValueType,
    newDefaultValue: getOptionalDefaultValue(group),
  };
  return isDefined(group.id)
    ? {
        type: ActionValueChangeIdentifierType.ID,
        id: group.id,
        ...base,
      }
    : {
        type: ActionValueChangeIdentifierType.FIELD,
        field: group.radio,
        ...base,
      };
};

const getOptionalDefaultValue = (
  group: ActionValueFieldGroup
): string | undefined => {
  if (group.type === VariableType.Enum.ENUM && !group.enumValues.length) {
    return '';
  }
};

export const isIdIdentifiedActionValuePayload = (
  payload: ActionValueChange | ActionValueTypeChange
): payload is IdedActionValueChange | IdedActionValueChangeType =>
  payload.type === ActionValueChangeIdentifierType.ID;

export type ActionValueChange =
  | FieldedActionValueChange
  | IdedActionValueChange;
export type ActionValueTypeChange =
  | FieldedActionValueChangeType
  | IdedActionValueChangeType;
