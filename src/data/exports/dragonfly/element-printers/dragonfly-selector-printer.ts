import { SleightDataInternalFormat } from '../../../data-formats';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { Printer } from '../../printer';

export class DragonflySelectorPrinter implements Printer<SelectorDTO> {
  printItem(selector: SelectorDTO, _data: SleightDataInternalFormat): string {
    return selector.items
      .map((item) => item.value)
      .join(' | ')
      .trim();
  }
}
