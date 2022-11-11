import { VariableType } from '../../../../model/variable/variable-types';

export enum DragonflyActionValueResolverResultType {
  ENTER_TEXT,
  ENTER_NUMBER,
  ENTER_ENUM,
  USE_VARIABLE,
}

type DragonflyActionValueResolverValueResult = {
  type:
    | DragonflyActionValueResolverResultType.ENTER_TEXT
    | DragonflyActionValueResolverResultType.ENTER_NUMBER
    | DragonflyActionValueResolverResultType.ENTER_ENUM;
  value: string;
};

export type DragonflyActionValueResolverVariableResult = {
  type: DragonflyActionValueResolverResultType.USE_VARIABLE;
  variableId: string;
  variableType: VariableType.Type;
};

export type DragonflyActionValueResolverResult =
  | DragonflyActionValueResolverValueResult
  | DragonflyActionValueResolverVariableResult;
