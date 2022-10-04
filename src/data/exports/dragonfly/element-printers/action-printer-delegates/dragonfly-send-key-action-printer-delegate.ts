import { quote } from '../../../../../core/common/common-functions';
import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { ExportError } from '../../../../../error/export-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import {
  isSendKeyAction,
  SendKeyAction,
  SendKeyHoldReleaseAction,
  SendKeyPressAction,
} from '../../../../model/action/send-key/send-key';
import { SendKeyMode } from '../../../../model/action/send-key/send-key-modes';
import { ElementNamePrinter } from '../../../element-name-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  DragonflyActionValueResolverResult,
  DragonflyActionValueResolverResultType,
  resultIsEmpty,
  resultToArg,
  resultToDFStrInterp,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflySendKeyPrinter implements DragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementNamePrinter: ElementNamePrinter
  ) {}

  printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): string | undefined {
    if (isSendKeyAction(action)) {
      const args: string[] = [];
      const sendKeyMode = action.sendKeyMode;
      switch (sendKeyMode) {
        case SendKeyMode.Enum.PRESS:
          args.push(this.getKeyPressArgs(action, data));
          break;
        case SendKeyMode.Enum.HOLD_RELEASE:
          args.push(this.getKeyHoldReleaseArgs(action, data));
          break;
        default:
          throw new ExhaustivenessFailureError(sendKeyMode);
      }
      return ['Key(', args.join(', '), ')'].join('');
    }
  }

  private getKeyPressArgs(
    action: SendKeyPressAction,
    data: SleightDataInternalFormat
  ): string {
    const args: string[] = [];
    args.push(this.getModifiers(action));
    //
    const keyToSendResult = this.actionValueResolver.resolve(
      action.keyToSend,
      data
    );
    args.push(this.enumKeyResultToArg(keyToSendResult));
    //
    const innerPauseResult = this.actionValueResolver.resolve(
      action.innerPause,
      data
    );
    if (!resultIsEmpty(innerPauseResult)) {
      const arg = resultToArg(innerPauseResult)(this.elementNamePrinter);
      args.push('/' + arg);
    }
    //
    const repeatResult = this.actionValueResolver.resolve(action.repeat, data);
    if (!resultIsEmpty(repeatResult)) {
      const arg = resultToArg(repeatResult)(this.elementNamePrinter);
      args.push(':' + arg);
    }
    //
    const outerPauseResult = this.actionValueResolver.resolve(
      action.outerPause,
      data
    );
    if (!resultIsEmpty(outerPauseResult)) {
      const arg = resultToArg(outerPauseResult)(this.elementNamePrinter);
      args.push('/' + arg);
    }
    return quote(args.join(''));
  }

  private getKeyHoldReleaseArgs(
    action: SendKeyHoldReleaseAction,
    data: SleightDataInternalFormat
  ): string {
    const args: string[] = [];
    args.push(this.getModifiers(action));
    //
    const keyToSendResult = this.actionValueResolver.resolve(
      action.keyToSend,
      data
    );
    args.push(this.enumKeyResultToArg(keyToSendResult));
    //
    const directionResult = this.actionValueResolver.resolve(
      action.direction,
      data
    );
    args.push(':' + this.enumDirectionResultToArg(directionResult));
    //
    const outerPauseResult = this.actionValueResolver.resolve(
      action.outerPause,
      data
    );
    if (!resultIsEmpty(outerPauseResult)) {
      const arg = resultToArg(outerPauseResult)(this.elementNamePrinter);
      args.push('/' + arg);
    }
    return quote(args.join(''));
  }

  private getModifiers(action: SendKeyAction): string {
    const args: string[] = [
      { character: 'c', enabled: action.modifiers.control },
      { character: 'a', enabled: action.modifiers.alt },
      { character: 's', enabled: action.modifiers.shift },
      { character: 'w', enabled: action.modifiers.windows },
    ]
      .filter((key) => key.enabled)
      .map((key) => key.character);
    if (args.length) {
      args.push('-');
    }
    return args.join('');
  }

  private enumKeyResultToArg(
    result: DragonflyActionValueResolverResult
  ): string {
    const arg =
      result.type === DragonflyActionValueResolverResultType.USE_VARIABLE
        ? resultToDFStrInterp(result)(this.elementNamePrinter)
        : this.extractKeyFromEnumValueWithRegex(result.value);
    return arg;
  }

  private enumDirectionResultToArg = (
    result: DragonflyActionValueResolverResult
  ): string => {
    const arg =
      result.type === DragonflyActionValueResolverResultType.USE_VARIABLE
        ? resultToDFStrInterp(result)(this.elementNamePrinter)
        : result.value.toLowerCase().replaceAll(' ', '');
    return arg;
  };

  private extractKeyFromEnumValueWithRegex(value: string): string {
    const matchPattern1 = value.match(/^(.{1})[ ]\(.+\)$/);
    if (matchPattern1) {
      return matchPattern1[1];
    }
    const matchPattern2 = value.match(/^\((.+)\)$/);
    if (matchPattern2) {
      return matchPattern2[1];
    }
    throw new ExportError('unhandled keyboard key: ' + value);
  }
}
