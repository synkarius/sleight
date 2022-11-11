import { SleightDataInternalFormat } from '../../../data-formats';
import { PythonFn } from '../../../model/fn/fn';
import { Printer } from '../../printer';

/** Prints imports for function. */
export class DragonflyFnImportPrinter implements Printer<PythonFn> {
  printItem(fn: PythonFn, _data: SleightDataInternalFormat): string {
    const path = fn.importTokens.join('.');
    return `from ${path} import ${fn.name}`;
  }
}
