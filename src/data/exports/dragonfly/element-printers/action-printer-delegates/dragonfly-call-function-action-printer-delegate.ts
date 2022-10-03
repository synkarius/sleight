import { NotImplementedError } from '../../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import { ElementNamePrinter } from '../../../element-name-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyCallFunctionPrinter
  implements DragonflyActionPrinterDelegate
{
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementNamePrinter: ElementNamePrinter
  ) {}

  printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): string | undefined {
    if (isCallFunctionAction(action)) {
      throw new NotImplementedError('DragonflyCallFunctionPrinter');
    }
    return undefined;
  }
}
