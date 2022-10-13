import { ActionValueType } from '../../../data/model/action/action-value-type';
import { Field } from '../../../validation/validation-field';

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
    ActionValueTyped {}
export const createFieldedActionValueChangeType = (
  field: Field,
  actionValueType: ActionValueType.Type
): FieldedActionValueChangeType => {
  return {
    type: ActionValueChangeIdentifierType.FIELD,
    field,
    actionValueType,
  };
};
interface IdedActionValueChangeType extends IdIdentified, ActionValueTyped {}
export const createIdedActionValueChangeType = (
  id: string,
  actionValueType: ActionValueType.Type
): IdedActionValueChangeType => {
  return {
    type: ActionValueChangeIdentifierType.ID,
    id,
    actionValueType,
  };
};

export type ActionValueChange =
  | FieldedActionValueChange
  | IdedActionValueChange;
export type ActionValueTypeChange =
  | FieldedActionValueChangeType
  | IdedActionValueChangeType;
