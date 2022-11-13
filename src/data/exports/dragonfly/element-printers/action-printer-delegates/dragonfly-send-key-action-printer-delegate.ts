import { Maybe, none, some } from '../../../../../core/common/maybe';
import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { ExportError } from '../../../../../error/export-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isVariableActionValue } from '../../../../model/action/action-value';
import {
  isSendKeyAction,
  isSendKeyHoldReleaseAction,
  isSendKeyPressAction,
  SendKeyAction,
  SendKeyHoldReleaseAction,
} from '../../../../model/action/send-key/send-key';
import { SendKeyMode } from '../../../../model/action/send-key/send-key-modes';
import { PythonFn, PythonFnParameter } from '../../../../model/fn/fn';
import { FnType } from '../../../../model/fn/fn-types';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { PrintableValue, PrintableValueType } from '../../../printable-value';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { AbstractDragonflyActionAsFunctionPrinterDelegate } from './abstract-dragonfly-action-as-function-printer-delegate';

export class DragonflySendKeyPrinter extends AbstractDragonflyActionAsFunctionPrinterDelegate {
  constructor(
    actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(actionValueResolver, elementTokenPrinter);
  }

  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isSendKeyAction(action)) {
      const avParams = this.getPrintableValues(action);
      const fnParams = this.getFnParameters(action);
      const executeKey: PythonFn = {
        id: '',
        name: 'execute_key',
        roleKey: '',
        type: FnType.Enum.PYTHON,
        enabled: true,
        locked: true,
        importTokens: [],
        parameters: fnParams,
      };
      return some(this.printActionAsFunction(avParams, executeKey, data));
    }
    return none();
  }

  private getPrintableValues(sendKeyAction: SendKeyAction): PrintableValue[] {
    const sendKeyMode = sendKeyAction.sendKeyMode;
    switch (sendKeyMode) {
      case SendKeyMode.Enum.PRESS:
        return [
          this.extractKeyToSend(sendKeyAction),
          this.getModifiers(sendKeyAction),
          this.wrapActionValue(sendKeyAction.outerPause),
          this.wrapActionValue(sendKeyAction.repeat),
          this.wrapActionValue(sendKeyAction.innerPause),
        ];
      case SendKeyMode.Enum.HOLD_RELEASE:
        return [
          this.extractKeyToSend(sendKeyAction),
          this.getModifiers(sendKeyAction),
          this.wrapActionValue(sendKeyAction.outerPause),
          this.extractDirection(sendKeyAction),
        ];
      default:
        throw new ExhaustivenessFailureError(sendKeyMode);
    }
  }

  private extractKeyToSend(sendKeyAction: SendKeyAction): PrintableValue {
    if (isVariableActionValue(sendKeyAction.keyToSend)) {
      return this.wrapActionValue(sendKeyAction.keyToSend);
    }
    const matchPattern = sendKeyAction.keyToSend.value.match(/^.*\((.+)\)$/);
    if (matchPattern) {
      return {
        type: PrintableValueType.STRING_VALUE,
        value: matchPattern[1],
      };
    }
    throw new ExportError(
      'unhandled keyboard key: ' + sendKeyAction.keyToSend.value
    );
  }

  private extractDirection(
    sendKeyHoldReleaseAction: SendKeyHoldReleaseAction
  ): PrintableValue {
    if (isVariableActionValue(sendKeyHoldReleaseAction.direction)) {
      return this.wrapActionValue(sendKeyHoldReleaseAction.direction);
    }
    return {
      type: PrintableValueType.STRING_VALUE,
      value: sendKeyHoldReleaseAction.direction.value
        .toLowerCase()
        .replaceAll(' ', ''),
    };
  }

  /** This is kind of a hack. Do better after v0.1.0. */
  private getModifiers(sendKeyAction: SendKeyAction): PrintableValue {
    const modifiers: string =
      [
        sendKeyAction.modifiers.control ? 'c' : '',
        sendKeyAction.modifiers.alt ? 'a' : '',
        sendKeyAction.modifiers.shift ? 's' : '',
        sendKeyAction.modifiers.windows ? 'w' : '',
      ].join('') || 'no-mods';
    return {
      type: PrintableValueType.STRING_VALUE,
      value: modifiers,
    };
  }

  private getFnParameters(action: SendKeyAction): PythonFnParameter[] {
    const parameters = [
      {
        id: '',
        name: 'key',
        type: VariableType.Enum.ENUM,
      },
      {
        id: '',
        name: 'mods',
        type: VariableType.Enum.TEXT,
      },
      {
        id: '',
        name: 'outer_pause',
        type: VariableType.Enum.NUMBER,
      },
    ];
    if (isSendKeyPressAction(action)) {
      parameters.push({
        id: '',
        name: 'repeat',
        type: VariableType.Enum.NUMBER,
      });
      parameters.push({
        id: '',
        name: 'inner_pause',
        type: VariableType.Enum.NUMBER,
      });
    } else if (isSendKeyHoldReleaseAction(action)) {
      parameters.push({
        id: '',
        name: 'direction',
        type: VariableType.Enum.ENUM,
      });
    }
    return parameters;
  }
}
