import { NotImplementedError } from '../../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyCallFunctionPrinter
  implements DragonflyActionPrinterDelegate
{
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementTokenPrinter: ElementTokenPrinter
  ) {}

  printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): string | undefined {
    if (isCallFunctionAction(action)) {
      const args: string[] = [];
      throw new NotImplementedError('DragonflyCallFunctionPrinter');
    }
    return undefined;
  }
}
