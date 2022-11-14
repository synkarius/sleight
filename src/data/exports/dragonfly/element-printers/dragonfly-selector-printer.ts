import { SleightDataInternalFormat } from '../../../data-formats';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { Preferences } from '../../../preferences/preferences';
import { Printer } from '../../printer';

export class DragonflySelectorPrinter implements Printer<SelectorDTO> {
  printItem(
    selector: SelectorDTO,
    _data: SleightDataInternalFormat,
    _prefs: Preferences
  ): string {
    return selector.items
      .map((item) => item.value)
      .join(' | ')
      .trim();
  }
}
