import { quote } from '../../../../../core/common/common-functions';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isSendTextAction } from '../../../../model/action/send-text/send-text';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  resultIsEmpty,
  resultToArg,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflySendTextPrinter
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
    if (isSendTextAction(action)) {
      const args: string[] = [];
      const textResult = this.actionValueResolver.resolve(action.text, data);
      if (!resultIsEmpty(textResult)) {
        args.push(quote(resultToArg(textResult)(this.elementTokenPrinter)));
      }
      return ['Text(', args.join(', '), ')'].join('');
    }
  }
}
