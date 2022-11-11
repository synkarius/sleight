import { quote } from '../../../../../core/common/common-functions';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isWaitForWindowAction } from '../../../../model/action/wait-for-window/wait-for-window';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { DragonflyActionValueResolverResultType } from '../action-value/dragonfly-action-value-resolver-result';
import { AbstractDragonflyActionPrinterDelegate } from './abstract-action-printer-delegate';

export class DragonflyWaitForWindowPrinter extends AbstractDragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(elementTokenPrinter);
  }
  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isWaitForWindowAction(action)) {
      const args: string[] = [];
      //
      const executableResult = this.actionValueResolver.resolve(
        action.executable,
        data
      );
      if (!this.resultIsEmpty(executableResult)) {
        args.push('executable=' + quote(this.resultToArg(executableResult)));
      }
      //
      const titleResult = this.actionValueResolver.resolve(action.title, data);
      if (!this.resultIsEmpty(titleResult)) {
        args.push('title=' + quote(this.resultToArg(titleResult)));
      }
      //
      const waitSecondsResult = this.actionValueResolver.resolve(
        action.waitSeconds,
        data
      );
      if (!this.resultIsEmpty(waitSecondsResult)) {
        const arg = this.resultToArg(waitSecondsResult);
        args.push(
          'timeout=' +
            (waitSecondsResult.type ===
            DragonflyActionValueResolverResultType.USE_VARIABLE
              ? quote(arg)
              : arg)
        );
      }
      //
      return some(['WaitWindow(', args.join(', '), ')'].join(''));
    }
    return none();
  }
}
