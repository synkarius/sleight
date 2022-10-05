import { isEmpty, quote } from '../../../../../core/common/common-functions';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isBringAppAction } from '../../../../model/action/bring-app/bring-app';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  resultIsEmpty,
  resultToArg,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyBringAppPrinter
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
    if (isBringAppAction(action)) {
      const args: string[] = [];
      //
      const appPathResult = this.actionValueResolver.resolve(
        action.appPath,
        data
      );
      if (!resultIsEmpty(appPathResult)) {
        args.push(quote(resultToArg(appPathResult)(this.elementTokenPrinter)));
      }
      //
      const appTitleResult = this.actionValueResolver.resolve(
        action.appTitle,
        data
      );
      if (!resultIsEmpty(appTitleResult)) {
        args.push(
          'title=' +
            quote(resultToArg(appTitleResult)(this.elementTokenPrinter))
        );
      }
      //
      const startDirResult = this.actionValueResolver.resolve(
        action.startDir,
        data
      );
      if (!resultIsEmpty(startDirResult)) {
        args.push(
          'cwd=' + quote(resultToArg(startDirResult)(this.elementTokenPrinter))
        );
      }
      //
      return ['BringApp(', args.join(', '), ')'].join('');
    }
  }
}
