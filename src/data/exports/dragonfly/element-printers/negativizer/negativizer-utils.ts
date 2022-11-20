import { Reader } from '../../../../../di/reader';
import { ElementType } from '../../../../model/element-types';
import { FnParameter } from '../../../../model/fn/fn';
import { isRangeVariable } from '../../../../model/variable/variable';
import { VariableDTO } from '../../../../model/variable/variable-dto';
import { ElementTokenPrinter } from '../../../element-token-printer';

const prefix = 'n_';

export const requiresNegativizer = (variable: VariableDTO): boolean =>
  isRangeVariable(variable) && variable.beginInclusive < 0;

export const getNegativizerTokenForVariable = (
  variableId: string
): Reader<ElementTokenPrinter, string> => {
  return (elementTokenPrinter) => {
    return (
      prefix +
      elementTokenPrinter.printElementToken(
        variableId,
        ElementType.Enum.VARIABLE
      )
    );
  };
};

export const getNegativizerTokenForFnParameter = (
  param: FnParameter
): string => {
  return prefix + param.name;
};
