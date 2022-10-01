import { SleightDataInternalFormat } from '../../../data-formats';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { ElementPrinter } from './element-printer';

export class DragonflySelectorPrinter implements ElementPrinter<SelectorDTO> {
  printElement(
    selector: SelectorDTO,
    _data: SleightDataInternalFormat
  ): string {
    return selector.items
      .map((item) => item.value)
      .join(' | ')
      .trim();
  }
}
