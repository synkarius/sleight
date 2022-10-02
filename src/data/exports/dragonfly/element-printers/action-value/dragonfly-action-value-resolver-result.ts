import { Reader } from '../../../../../di/reader';
import { ElementType } from '../../../../model/element-types';
import { ElementNamePrinter } from '../../../element-name-printer';

export enum DragonflyActionValueResolverResultType {
  ENTER_TEXT,
  ENTER_NUMBER,
  ENTER_ENUM,
  USE_VARIABLE,
}

export type DragonflyActionValueResolverResult = {
  type: DragonflyActionValueResolverResultType;
  value: string;
};

export const resultToArg = (
  result: DragonflyActionValueResolverResult
): Reader<ElementNamePrinter, string> => {
  return (elementNamePrinter: ElementNamePrinter) => {
    const arg =
      result.type === DragonflyActionValueResolverResultType.USE_VARIABLE
        ? `%(${elementNamePrinter.printElementName(
            result.value,
            ElementType.Enum.VARIABLE
          )})`
        : result.value;
    return arg;
  };
};
