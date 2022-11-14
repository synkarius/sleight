import { SleightDataInternalFormat } from '../../../data-formats';
import { Context } from '../../../model/context/context';
import { ContextType } from '../../../model/context/context-types';
import { Preferences } from '../../../preferences/preferences';
import { Printer } from '../../printer';

export class DragonflyContextPrinter implements Printer<Context> {
  printItem(
    context: Context,
    _data: SleightDataInternalFormat,
    _prefs: Preferences
  ): string {
    const matched =
      context.type === ContextType.Enum.EXECUTABLE_NAME
        ? 'executable'
        : 'title';
    return `AppContext(${matched}="${context.matcher}")`;
  }
}
