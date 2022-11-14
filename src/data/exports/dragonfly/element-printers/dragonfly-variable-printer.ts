import { MapUtil } from '../../../../core/common/map-util';
import { SleightDataInternalFormat } from '../../../data-formats';
import { ElementType } from '../../../model/element-types';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { VariableType } from '../../../model/variable/variable-types';
import { Preferences } from '../../../preferences/preferences';
import { ElementTokenPrinter } from '../../element-token-printer';
import { Printer } from '../../printer';

export class DragonflyVariablePrinter implements Printer<VariableDTO> {
  constructor(
    private elementTokenPrinter: ElementTokenPrinter,
    private selectorPrinter: Printer<SelectorDTO>
  ) {}

  printItem(
    variable: VariableDTO,
    data: SleightDataInternalFormat,
    prefs: Preferences
  ): string {
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
              const printedSelector = this.selectorPrinter.printItem(
                selector,
                data,
                prefs
              );
              return `"${printedSelector}": "${item.value}"`;
            })
            .join(', ') +
          '}';
        return `Choice("${name}", ${choiceItems})`;
    }
  }
}
