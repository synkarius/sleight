import { MapUtil } from '../../../../core/common/map-util';
import { isSome } from '../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../data-formats';
import { ElementType } from '../../../model/element-types';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { VariableType } from '../../../model/variable/variable-types';
import { Preferences } from '../../../preferences/preferences';
import { ElementTokenPrinter } from '../../element-token-printer';
import { Printer } from '../../printer';
import { DragonflyNegativizerPrinter } from './negativizer/dragonfly-negativizer-printer-augmenter';

export class DragonflyVariablePrinter implements Printer<VariableDTO> {
  constructor(
    private elementTokenPrinter: ElementTokenPrinter,
    private selectorPrinter: Printer<SelectorDTO>,
    private negativizerAugmenter: DragonflyNegativizerPrinter
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
        const sir = `ShortIntegerRef("${name}", ${variable.beginInclusive}, ${variable.endInclusive})`;
        // negativizer
        const maybeNegativizer = this.negativizerAugmenter.printForExtras(
          variable.id,
          data
        );
        const negativizer = isSome(maybeNegativizer)
          ? `${maybeNegativizer.value}, `
          : '';
        return negativizer + sir;
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
