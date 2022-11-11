import { isDefined } from '../../../../core/common/common-functions';
import { findFirst } from '../../../../core/common/lazy';
import { isSome } from '../../../../core/common/maybe';
import { DragonflyActionPrinterDelegateArray } from '../../../../di/di-collection-types';
import { MissingDelegateError } from '../../../../error/missing-delegate-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { Printer } from '../../printer';

export class DelegatingDragonflyActionPrinter implements Printer<Action> {
  constructor(private delegates: DragonflyActionPrinterDelegateArray) {}

  printItem(action: Action, data: SleightDataInternalFormat): string {
    const printed = findFirst(this.delegates, (delegate) =>
      delegate.printAction(action, data)
    );
    if (isSome(printed)) {
      return printed.value;
    }
    throw new MissingDelegateError('DragonflyActionPrinter');
  }
}
