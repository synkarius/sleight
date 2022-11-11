import { quote } from '../../../../../core/common/common-functions';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isSendTextAction } from '../../../../model/action/send-text/send-text';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { AbstractDragonflyActionPrinterDelegate } from './abstract-action-printer-delegate';

export class DragonflySendTextPrinter extends AbstractDragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(elementTokenPrinter);
  }

  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isSendTextAction(action)) {
      const args: string[] = [];
      const textResult = this.actionValueResolver.resolve(action.text, data);
      if (!this.resultIsEmpty(textResult)) {
        args.push(quote(this.resultToArg(textResult)));
      }
      return some(['Text(', args.join(', '), ')'].join(''));
    }
    return none();
  }
}
