import { quote } from '../../../../../core/common/common-functions';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isWaitForWindowAction } from '../../../../model/action/wait-for-window/wait-for-window';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  DragonflyActionValueResolverResultType,
  resultIsEmpty,
  resultToArg,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyWaitForWindowPrinter
  implements DragonflyActionPrinterDelegate
{
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementTokenPrinter: ElementTokenPrinter
  ) {}
  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isWaitForWindowAction(action)) {
      const args: string[] = [];
      //
      const executableResult = this.actionValueResolver.resolve(
        action.executable,
        data
      );
      if (!resultIsEmpty(executableResult)) {
        args.push(
          'executable=' +
            quote(resultToArg(executableResult)(this.elementTokenPrinter))
        );
      }
      //
      const titleResult = this.actionValueResolver.resolve(action.title, data);
      if (!resultIsEmpty(titleResult)) {
        args.push(
          'title=' + quote(resultToArg(titleResult)(this.elementTokenPrinter))
        );
      }
      //
      const waitSecondsResult = this.actionValueResolver.resolve(
        action.waitSeconds,
        data
      );
      if (!resultIsEmpty(waitSecondsResult)) {
        const arg = resultToArg(waitSecondsResult)(this.elementTokenPrinter);
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
