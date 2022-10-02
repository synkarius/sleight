import { isEmpty, quote } from '../../../../../core/common/common-functions';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isBringAppAction } from '../../../../model/action/bring-app/bring-app';
import { ElementNamePrinter } from '../../../element-name-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { resultToArg } from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyBringAppPrinter
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
    if (isBringAppAction(action)) {
      const args: string[] = [];
      //
      const appPathResult = this.actionValueResolver.resolve(
        action.appPath,
        data
      );
      if (!isEmpty(appPathResult.value)) {
        args.push(
          quote(resultToArg(appPathResult)(this.elementNamePrinter) + 's')
        );
      }
      //
      const appTitleResult = this.actionValueResolver.resolve(
        action.appTitle,
        data
      );
      if (!isEmpty(appTitleResult.value)) {
        args.push(
          'title=' +
            quote(resultToArg(appTitleResult)(this.elementNamePrinter) + 's')
        );
      }
      //
      const startDirResult = this.actionValueResolver.resolve(
        action.startDir,
        data
      );
      if (!isEmpty(startDirResult.value)) {
        args.push(
          'cwd=' +
            quote(resultToArg(startDirResult)(this.elementNamePrinter) + 's')
        );
      }
      //
      return ['BringApp(', args.join(', '), ')'].join('');
    }
  }
}
