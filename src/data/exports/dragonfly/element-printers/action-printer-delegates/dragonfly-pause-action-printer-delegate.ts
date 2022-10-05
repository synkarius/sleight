import { isEmpty, quote } from '../../../../../core/common/common-functions';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isPauseAction } from '../../../../model/action/pause/pause';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  DragonflyActionValueResolverResultType,
  resultIsEmpty,
  resultToArg,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyPausePrinter implements DragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementTokenPrinter: ElementTokenPrinter
  ) {}

  printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): string | undefined {
    if (isPauseAction(action)) {
      const args: string[] = [];
      //
      const centisecondsResult = this.actionValueResolver.resolve(
        action.centiseconds,
        data
      );
      if (!resultIsEmpty(centisecondsResult)) {
        const arg = resultToArg(centisecondsResult)(this.elementTokenPrinter);
        args.push(
          centisecondsResult.type ===
            DragonflyActionValueResolverResultType.ENTER_NUMBER
            ? arg
            : quote(arg)
        );
      }

      //
      return ['Pause(', args.join(', '), ')'].join('');
    }
  }
}
