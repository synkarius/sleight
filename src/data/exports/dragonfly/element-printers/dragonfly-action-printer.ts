import { isDefined } from '../../../../core/common/common-functions';
import { DragonflyActionPrinterDelegateArray } from '../../../../di/di-collection-types';
import { MissingDelegateError } from '../../../../error/missing-delegate-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { ElementPrinter } from './element-printer';

export class DelegatingDragonflyActionPrinter
  implements ElementPrinter<Action>
{
  constructor(private delegates: DragonflyActionPrinterDelegateArray) {}

  printElement(action: Action, data: SleightDataInternalFormat): string {
    const printed = this.delegates
      .map((delegate) => delegate.printAction(action, data))
      .find(isDefined);
    if (printed) {
      return printed;
    }
    throw new MissingDelegateError('DragonflyActionPrinter');
  }
}
