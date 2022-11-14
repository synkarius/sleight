import { quote } from '../../../../core/common/common-functions';
import { MapUtil } from '../../../../core/common/map-util';
import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { ElementType } from '../../../model/element-types';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { SpecDTO, SpecItemDTO } from '../../../model/spec/spec-dto';
import { SpecItemType } from '../../../model/spec/spec-item-type';
import { Preferences } from '../../../preferences/preferences';
import { ElementTokenPrinter } from '../../element-token-printer';
import { Printer } from '../../printer';

export class DragonflySpecPrinter implements Printer<SpecDTO> {
  constructor(
    private elementTokenPrinter: ElementTokenPrinter,
    private selectorPrinter: Printer<SelectorDTO>
  ) {}

  printItem(
    spec: SpecDTO,
    data: SleightDataInternalFormat,
    prefs: Preferences
  ): string {
    const partiallyProcessed = spec.items.map(
      (specItem): PrintingSpecItem => ({
        ...specItem,
        token: this.printSpecItemToken(specItem, data, prefs),
      })
    );
    return this.finishSpecsProcessing(partiallyProcessed);
  }

  private printSpecItemToken(
    specItem: SpecItemDTO,
    data: SleightDataInternalFormat,
    prefs: Preferences
  ): string {
    switch (specItem.itemType) {
      case SpecItemType.Enum.SELECTOR:
        const selector = MapUtil.getOrThrow(data.selectors, specItem.itemId);
        return this.selectorPrinter.printItem(selector, data, prefs);
      case SpecItemType.Enum.VARIABLE:
        const variable = MapUtil.getOrThrow(data.variables, specItem.itemId);
        return (
          '<' +
          this.elementTokenPrinter.printElementToken(
            variable.id,
            ElementType.Enum.VARIABLE
          ) +
          '>'
        );
      default:
        throw new ExhaustivenessFailureError(specItem.itemType);
    }
  }

  private finishSpecsProcessing(partially: PrintingSpecItem[]): string {
    const result: string[] = [];
    for (let i = 0; i < partially.length; i++) {
      const item = partially[i];
      const prevExists = i > 0;
      const nextExists = i + 1 < partially.length;

      const prevWasGrouped = prevExists && partially[i - 1].grouped;
      if (
        (item.grouped && !prevWasGrouped) ||
        (!item.grouped && item.optional)
      ) {
        result.push('[');
      }

      // TODO: don't need to always add parens
      const addParens = item.token.includes('|');
      result.push(addParens ? '(' : '');
      result.push(item.token);
      result.push(addParens ? ')' : '');

      const nextIsGrouped = nextExists && partially[i + 1].grouped;
      if (
        (item.grouped && !nextIsGrouped) ||
        (!item.grouped && item.optional)
      ) {
        result.push(']');
      }
    }
    return quote(
      result
        .join(' ')
        .replaceAll(/[ ]{2,}/g, ' ')
        .trim()
    );
  }
}

type PrintingSpecItem = Pick<SpecItemDTO, 'optional' | 'grouped'> & {
  token: string;
};
