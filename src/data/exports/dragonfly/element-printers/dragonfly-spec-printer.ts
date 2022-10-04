import { MapUtil } from '../../../../core/common/map-util';
import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { ElementType } from '../../../model/element-types';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { SpecDTO, SpecItemDTO } from '../../../model/spec/spec-dto';
import { SpecItemType } from '../../../model/spec/spec-item-type';
import { ElementNamePrinter } from '../../element-name-printer';
import { ElementPrinter } from './element-printer';

export class DragonflySpecPrinter implements ElementPrinter<SpecDTO> {
  constructor(
    private elementNamePrinter: ElementNamePrinter,
    private selectorPrinter: ElementPrinter<SelectorDTO>
  ) {}

  printElement(spec: SpecDTO, data: SleightDataInternalFormat): string {
    const partiallyProcessed = spec.items.map(
      (specItem): PrintingSpecItem => ({
        ...specItem,
        token: this.printSpecItemToken(specItem, data),
      })
    );
    return this.finishSpecsProcessing(partiallyProcessed);
  }

  printSpecItemToken(
    specItem: SpecItemDTO,
    data: SleightDataInternalFormat
  ): string {
    switch (specItem.itemType) {
      case SpecItemType.Enum.SELECTOR:
        const selector = MapUtil.getOrThrow(data.selectors, specItem.itemId);
        return this.selectorPrinter.printElement(selector, data);
      case SpecItemType.Enum.VARIABLE:
        const variable = MapUtil.getOrThrow(data.variables, specItem.itemId);
        return (
          '<' +
          this.elementNamePrinter.printElementName(
            variable.name,
            ElementType.Enum.VARIABLE
          ) +
          '>'
        );
      default:
        throw new ExhaustivenessFailureError(specItem.itemType);
    }
  }

  finishSpecsProcessing(partially: PrintingSpecItem[]): string {
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
    return result
      .join(' ')
      .replaceAll(/[ ]{2,}/g, ' ')
      .trim();
  }
}

type PrintingSpecItem = Pick<SpecItemDTO, 'optional' | 'grouped'> & {
  token: string;
};