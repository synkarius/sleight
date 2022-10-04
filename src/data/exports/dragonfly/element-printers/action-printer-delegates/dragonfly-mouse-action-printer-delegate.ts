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
  DragonflyActionValueResolverResult,
  resultIsEmpty,
  resultToArg,
  resultToDFStrInterp,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';
import { DragonflyActionValueResolverResultType } from '../action-value/dragonfly-action-value-resolver-result';
import { MouseMovementType } from '../../../../model/action/mouse/mouse-movement-type';

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
          args.push(this.getClickArgs(action, data));
          break;
        case MouseActionType.Enum.HOLD_RELEASE:
          args.push(this.getHoldReleaseArgs(action, data));
          break;
        case MouseActionType.Enum.MOVE:
          args.push(this.getMoveArgs(action, data));
          break;
        default:
          throw new ExhaustivenessFailureError(mouseActionType);
      }

      return ['Mouse(', args.join(', '), ')'].join('');
    }
  }

  private getClickArgs(
    action: ClickMouseAction,
    data: SleightDataInternalFormat
  ): string {
    const args: string[] = [];
    //
    const mouseButtonResult = this.actionValueResolver.resolve(
      action.mouseButton,
      data
    );
    args.push(this.enumResultToArg(mouseButtonResult));
    //
    const pauseResult = this.actionValueResolver.resolve(action.pause, data);
    if (!resultIsEmpty(pauseResult)) {
      const arg = resultToArg(pauseResult)(this.elementNamePrinter);
      args.push(':' + arg);
    }
    //
    const repeatResult = this.actionValueResolver.resolve(action.repeat, data);
    if (!resultIsEmpty(repeatResult)) {
      const arg = resultToArg(repeatResult)(this.elementNamePrinter);
      args.push('/' + arg);
    }
    return quote(args.join(''));
  }

  private getHoldReleaseArgs(
    action: HoldReleaseMouseAction,
    data: SleightDataInternalFormat
  ): string {
    const args: string[] = [];
    //
    const mouseButtonResult = this.actionValueResolver.resolve(
      action.mouseButton,
      data
    );
    args.push(this.enumResultToArg(mouseButtonResult));
    //
    const directionResult = this.actionValueResolver.resolve(
      action.direction,
      data
    );
    args.push(this.enumResultToArg(directionResult));
    //
    const pauseResult = this.actionValueResolver.resolve(action.pause, data);
    if (!resultIsEmpty(pauseResult)) {
      const arg = resultToArg(pauseResult)(this.elementNamePrinter);
      args.push(':' + arg);
    }
    return quote(args.join(''));
  }

  private getMoveArgs(
    action: MoveMouseAction,
    data: SleightDataInternalFormat
  ): string {
    const args: string[] = [];
    let opening: string;
    let percentage: boolean = false;
    let closing: string;
    const mouseMoveType = action.mouseMovementType;
    switch (mouseMoveType) {
      case MouseMovementType.Enum.ABSOLUTE_PIXELS:
        /** pixels or percentages are allowed by Dragonfly
         * -- determined by whether it's a number between 0-1
         * -- presently, Sleight only exports this to pixels */
        opening = '[';
        closing = ']';
        break;
      case MouseMovementType.Enum.RELATIVE_PIXELS:
        // pixels-only allowed by Dragonfly
        opening = '<';
        closing = '>';
        break;
      case MouseMovementType.Enum.WINDOW_PERCENTAGE:
        /** pixels or percentages are allowed by Dragonfly
         * -- determined by whether it's a number between 0-1
         * -- presently, Sleight only exports this to percentages */
        opening = '(';
        closing = ')';
        percentage = true;
        break;
      default:
        throw new ExhaustivenessFailureError(mouseMoveType);
    }

    args.push(opening);
    const xResult = this.actionValueResolver.resolve(action.x, data);
    args.push(this.numericResultToArg(xResult, percentage));
    args.push(', ');
    const yResult = this.actionValueResolver.resolve(action.y, data);
    args.push(this.numericResultToArg(yResult, percentage));
    args.push(closing);

    return quote(args.join(''));
  }

  private numericResultToArg = (
    result: DragonflyActionValueResolverResult,
    isPercentage: boolean
  ): string => {
    if (result.type === DragonflyActionValueResolverResultType.USE_VARIABLE) {
      return resultToDFStrInterp(result)(this.elementNamePrinter);
    } else {
      let value = +result.value;
      value = isPercentage ? Math.min(0, Math.max(value, 100)) / 100 : value;
      return value + '';
    }
  };

  private enumResultToArg = (
    result: DragonflyActionValueResolverResult
  ): string => {
    const arg =
      result.type === DragonflyActionValueResolverResultType.USE_VARIABLE
        ? resultToDFStrInterp(result)(this.elementNamePrinter)
        : result.value.toLowerCase().replaceAll(' ', '');
    return arg;
  };
}
