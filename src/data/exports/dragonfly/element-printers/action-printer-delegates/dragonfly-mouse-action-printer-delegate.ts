import { quote } from '../../../../../core/common/common-functions';
import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import {
  ClickMouseAction,
  HoldReleaseMouseAction,
  isMouseAction,
  MoveMouseAction,
} from '../../../../model/action/mouse/mouse';
import { MouseActionType } from '../../../../model/action/mouse/mouse-action-type';
import { ElementNamePrinter } from '../../../element-name-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  resultIsEmpty,
  resultToArg,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';
import { DragonflyActionValueResolverResultType } from '../action-value/dragonfly-action-value-resolver-result';
import { NotImplementedError } from '../../../../../error/not-implemented-error';

export class DragonflyMousePrinter implements DragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementNamePrinter: ElementNamePrinter
  ) {}

  printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): string | undefined {
    if (isMouseAction(action)) {
      const args: string[] = [];

      const mouseActionType = action.mouseActionType;
      switch (mouseActionType) {
        case MouseActionType.Enum.CLICK:
          this.getClickArgs(action, data).forEach((arg) => args.push(arg));
          break;
        case MouseActionType.Enum.HOLD_RELEASE:
          this.getHoldReleaseArgs(action, data).forEach((arg) =>
            args.push(arg)
          );
          break;
        case MouseActionType.Enum.MOVE:
          this.getMoveArgs(action, data).forEach((arg) => args.push(arg));
          break;
        default:
          throw new ExhaustivenessFailureError(mouseActionType);
      }

      return ['Mouse(', args.join(', '), ')'].join('');
    }
  }

  getClickArgs(
    action: ClickMouseAction,
    data: SleightDataInternalFormat
  ): string[] {
    const args: string[] = [];
    //
    const mouseButtonResult = this.actionValueResolver.resolve(
      action.mouseButton,
      data
    );
    if (!resultIsEmpty(mouseButtonResult)) {
      args.push(quote(resultToArg(mouseButtonResult)(this.elementNamePrinter)));
    }
    //
    const pauseResult = this.actionValueResolver.resolve(action.pause, data);
    if (!resultIsEmpty(pauseResult)) {
      const arg = resultToArg(pauseResult)(this.elementNamePrinter);
      args.push(
        pauseResult.type === DragonflyActionValueResolverResultType.ENTER_NUMBER
          ? arg
          : quote(arg)
      );
    }
    //
    const repeatResult = this.actionValueResolver.resolve(action.repeat, data);
    if (!resultIsEmpty(repeatResult)) {
      const arg = resultToArg(repeatResult)(this.elementNamePrinter);
      args.push(
        repeatResult.type ===
          DragonflyActionValueResolverResultType.ENTER_NUMBER
          ? arg
          : quote(arg)
      );
    }
    return args;
  }

  getHoldReleaseArgs(
    action: HoldReleaseMouseAction,
    data: SleightDataInternalFormat
  ): string[] {
    throw new NotImplementedError('getHoldReleaseArgs');
  }

  getMoveArgs(
    action: MoveMouseAction,
    data: SleightDataInternalFormat
  ): string[] {
    throw new NotImplementedError('getMoveArgs');
  }
}
