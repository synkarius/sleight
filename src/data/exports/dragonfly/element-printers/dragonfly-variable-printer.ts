import { MapUtil } from '../../../../core/common/map-util';
import { SleightDataInternalFormat } from '../../../data-formats';
import { ElementType } from '../../../model/element-types';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { VariableType } from '../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../element-token-printer';
import { ElementPrinter } from './element-printer';

export class DragonflyVariablePrinter implements ElementPrinter<VariableDTO> {
  constructor(
    private elementTokenPrinter: ElementTokenPrinter,
    private selectorPrinter: ElementPrinter<SelectorDTO>
  ) {}

  printElement(variable: VariableDTO, data: SleightDataInternalFormat): string {
    const name = this.elementTokenPrinter.printElementToken(
      variable.id,
      ElementType.Enum.VARIABLE
    );
    switch (variable.type) {
      case VariableType.Enum.TEXT:
        return `Dictation("${name}")`;
      case VariableType.Enum.NUMBER:
        return `ShortIntegerRef("${name}", ${variable.beginInclusive}, ${variable.endInclusive})`;
      case VariableType.Enum.ENUM:
        //
        const choiceItems =
          '{' +
          variable.items
            .map((item) => {
              const selector = MapUtil.getOrThrow(
                data.selectors,
                item.selectorId
              );
              const printedSelector = this.selectorPrinter.printElement(
                selector,
                data
              );
              return `"${printedSelector}": "${item.value}"`;
            })
            .join(', ') +
          '}';
        return `Choice("${name}", ${choiceItems})`;
    }
  }
}
