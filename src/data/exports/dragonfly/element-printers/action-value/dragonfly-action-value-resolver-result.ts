import { isEmpty } from '../../../../../core/common/common-functions';
import { Reader } from '../../../../../di/reader';
import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { ElementType } from '../../../../model/element-types';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementNamePrinter } from '../../../element-name-printer';

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

type DragonflyActionValueResolverVariableResult = {
  type: DragonflyActionValueResolverResultType.USE_VARIABLE;
  variableName: string;
  variableType: VariableType.Type;
};

export type DragonflyActionValueResolverResult =
  | DragonflyActionValueResolverValueResult
  | DragonflyActionValueResolverVariableResult;

export const resultToArg = (
  result: DragonflyActionValueResolverResult
): Reader<ElementNamePrinter, string> => {
  return (elementNamePrinter: ElementNamePrinter) => {
    const arg =
      result.type === DragonflyActionValueResolverResultType.USE_VARIABLE
        ? resultToDFStrInterp(result)(elementNamePrinter)
        : result.value;
    return arg;
  };
};

/** Converts result to Dragonfly interpolation string. */
export const resultToDFStrInterp = (
  result: DragonflyActionValueResolverVariableResult
): Reader<ElementNamePrinter, string> => {
  return (elementNamePrinter) =>
    `%(${elementNamePrinter.printElementName(
      result.variableName,
      ElementType.Enum.VARIABLE
    )})` + resultStrInterpSuffix(result);
};

export const resultIsEmpty = (
  result: DragonflyActionValueResolverResult
): boolean => {
  const resultType = result.type;
  switch (resultType) {
    case DragonflyActionValueResolverResultType.USE_VARIABLE:
      return isEmpty(result.variableName);
    default:
      return isEmpty(result.value);
  }
};

export const resultStrInterpSuffix = (
  result: DragonflyActionValueResolverVariableResult
): string => {
  const variableType = result.variableType;
  switch (variableType) {
    case VariableType.Enum.TEXT:
    case VariableType.Enum.ENUM:
      return 's';
    case VariableType.Enum.NUMBER:
      return 'd';
    default:
      throw new ExhaustivenessFailureError(variableType);
  }
};
