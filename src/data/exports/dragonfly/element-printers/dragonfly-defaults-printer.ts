import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { ElementType } from '../../../model/element-types';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { VariableType } from '../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../element-token-printer';
import { Printer } from '../../printer';

export class DragonflyDefaultsPrinter implements Printer<VariableDTO> {
  constructor(private elementTokenPrinter: ElementTokenPrinter) {}

  printItem(variable: VariableDTO, _data: SleightDataInternalFormat): string {
    const name = this.elementTokenPrinter.printElementToken(
      variable.id,
      ElementType.Enum.VARIABLE
    );
    const variableType = variable.type;
    switch (variableType) {
      case VariableType.Enum.TEXT:
      case VariableType.Enum.ENUM:
        return `"${name}": "${variable.defaultValue}"`;
      case VariableType.Enum.NUMBER:
        return `"${name}": ${variable.defaultValue}`;
      default:
        throw new ExhaustivenessFailureError(variableType);
    }
  }
}
