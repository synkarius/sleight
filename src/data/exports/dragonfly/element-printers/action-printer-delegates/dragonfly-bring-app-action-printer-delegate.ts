import { quote } from '../../../../../core/common/common-functions';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isBringAppAction } from '../../../../model/action/bring-app/bring-app';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { AbstractDragonflyActionPrinterDelegate } from './abstract-action-printer-delegate';

export class DragonflyBringAppPrinter extends AbstractDragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(elementTokenPrinter);
  }
  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isBringAppAction(action)) {
      const args: string[] = [];
      //
      const appPathResult = this.actionValueResolver.resolve(
        action.appPath,
        data
      );
      if (!this.resultIsEmpty(appPathResult)) {
        args.push(quote(this.resultToArg(appPathResult)));
      }
      //
      const appTitleResult = this.actionValueResolver.resolve(
        action.appTitle,
        data
      );
      if (!this.resultIsEmpty(appTitleResult)) {
        args.push('title=' + quote(this.resultToArg(appTitleResult)));
      }
      //
      const startDirResult = this.actionValueResolver.resolve(
        action.startDir,
        data
      );
      if (!this.resultIsEmpty(startDirResult)) {
        args.push('cwd=' + quote(this.resultToArg(startDirResult)));
      }
      //
      return some(['BringApp(', args.join(', '), ')'].join(''));
    }
    return none();
  }
}
