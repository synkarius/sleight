import {
  Enablable,
  Ided,
  Lockable,
  Named,
  RoleKeyed,
  Typed,
} from '../../../domain';
import { VariableType } from '../variable-types';

export interface AbstractVariableDTO
  extends Enablable,
    Ided,
    Lockable,
    Named,
    RoleKeyed,
    Typed<VariableType.Type> {}

export interface TextVariableDTO extends AbstractVariableDTO {
  readonly type: typeof VariableType.Enum.TEXT;
  readonly defaultValue?: string;
}

export interface RangeVariableDTO extends AbstractVariableDTO {
  readonly type: typeof VariableType.Enum.RANGE;
  readonly beginInclusive: number;
  readonly endInclusive: number;
  readonly defaultValue?: number;
}

export interface ChoiceItemDTO extends Ided {
  readonly selectorId: string;
  readonly value: string;
}

export interface ChoiceVariableDTO extends AbstractVariableDTO {
  readonly type: typeof VariableType.Enum.CHOICE;
  readonly items: ChoiceItemDTO[];
  readonly defaultValue?: string;
}

export type VariableDTO =
  | TextVariableDTO
  | RangeVariableDTO
  | ChoiceVariableDTO;
