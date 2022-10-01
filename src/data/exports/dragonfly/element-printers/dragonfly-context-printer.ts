import { SleightDataInternalFormat } from '../../../data-formats';
import { Context } from '../../../model/context/context';
import { ContextType } from '../../../model/context/context-types';
import { ElementPrinter } from './element-printer';

export class DragonflyContextPrinter implements ElementPrinter<Context> {
  printElement(context: Context, _data: SleightDataInternalFormat): string {
    const matched =
      context.type === ContextType.Enum.EXECUTABLE_NAME
        ? 'executable'
        : 'title';
    return `AppContext(${matched}="${context.matcher}")`;
  }
}
