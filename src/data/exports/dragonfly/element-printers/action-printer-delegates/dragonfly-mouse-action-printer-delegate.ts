import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import {
  isClickMouseAction,
  isHoldReleaseMouseAction,
  isMouseAction,
  isMoveMouseAction,
  MouseAction,
} from '../../../../model/action/mouse/mouse';
import { MouseActionType } from '../../../../model/action/mouse/mouse-action-type';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { AbstractDragonflyActionAsFunctionPrinterDelegate } from './abstract-dragonfly-action-as-function-printer-delegate';
import { PythonFn, PythonFnParameter } from '../../../../model/fn/fn';
import { FnType } from '../../../../model/fn/fn-types';
import { PrintableValue, PrintableValueType } from '../../../printable-value';
import {
  EnterEnumActionValue,
  isVariableActionValue,
  VariableEnumActionValue,
} from '../../../../model/action/action-value';
import { MouseMovementType } from '../../../../model/action/mouse/mouse-movement-type';
import { DragonflyNegativizerPrinter } from '../negativizer/dragonfly-negativizer-printer-augmenter';
import { DragonflyBuiltinFnsProvider } from '../../builtin-fns/builtin-fns-supplier';

/**
 * Dragonfly mouse action export notes:
 * ----------------
 * - window
 *   - Dragonfly allows pixels or percentages: determined by whether it's a number between 0-1
 *   - syntax: (x,y)
 *   - v0.1.0 Sleight only exports this to percentages
 * - relative
 *   - Dragonfly only allows pixels
 *   - syntax: <x,y>
 * - absolute
 *   - Dragonfly allows pixels or percentages: determined by whether it's a number between 0-1
 *   - syntax [x,y]
 *   - v0.1.0 Sleight only exports this to pixels
 * */
export class DragonflyMousePrinter extends AbstractDragonflyActionAsFunctionPrinterDelegate {
  constructor(
    actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter,
    negativizerAugmenter: DragonflyNegativizerPrinter,
    private builtinFnsProvider: DragonflyBuiltinFnsProvider
  ) {
    super(actionValueResolver, elementTokenPrinter, negativizerAugmenter);
  }

  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isMouseAction(action)) {
      const avParams = this.getPrintableValues(action);
      const fnParams = this.getFnParameters(action);
      const executeMouse: PythonFn = {
        id: '',
        name: this.getFnName(action),
        roleKey: '',
        type: FnType.Enum.PYTHON,
        enabled: true,
        locked: true,
        importTokens: [],
        parameters: fnParams,
      };
      return some(this.printActionAsFunction(avParams, executeMouse, data));
    }
    return none();
  }

  private getFnName(mouseAction: MouseAction): string {
    const mouseActionType = mouseAction.mouseActionType;
    switch (mouseActionType) {
      case MouseActionType.Enum.MOVE:
        const mouseMovementType = mouseAction.mouseMovementType;
        switch (mouseMovementType) {
          case MouseMovementType.Enum.ABSOLUTE_PIXELS:
            return this.builtinFnsProvider.getMouseMoveAbsPx().name;
          case MouseMovementType.Enum.RELATIVE_PIXELS:
            return this.builtinFnsProvider.getMouseMoveRelPx().name;
          case MouseMovementType.Enum.WINDOW_PERCENTAGE:
            return this.builtinFnsProvider.getMouseMoveWinPct().name;
          default:
            throw new ExhaustivenessFailureError(mouseMovementType);
        }
      case MouseActionType.Enum.CLICK:
        return this.builtinFnsProvider.getMouseClick().name;
      case MouseActionType.Enum.HOLD_RELEASE:
        return this.builtinFnsProvider.getMouseHoldRelease().name;
      default:
        throw new ExhaustivenessFailureError(mouseActionType);
    }
  }

  private getPrintableValues(mouseAction: MouseAction): PrintableValue[] {
    const mouseActionType = mouseAction.mouseActionType;
    switch (mouseActionType) {
      case MouseActionType.Enum.MOVE:
        return [
          this.wrapActionValue(mouseAction.x),
          this.wrapActionValue(mouseAction.y),
        ];
      case MouseActionType.Enum.CLICK:
        return [
          this.extractEnum(mouseAction.mouseButton),
          this.wrapActionValue(mouseAction.repeat),
          this.wrapActionValue(mouseAction.pause),
        ];
      case MouseActionType.Enum.HOLD_RELEASE:
        return [
          this.extractEnum(mouseAction.mouseButton),
          this.extractEnum(mouseAction.direction),
          this.wrapActionValue(mouseAction.pause),
        ];
      default:
        throw new ExhaustivenessFailureError(mouseActionType);
    }
  }

  private getFnParameters(action: MouseAction): PythonFnParameter[] {
    if (isMoveMouseAction(action)) {
      const mouseMoveParams =
        this.builtinFnsProvider.getMouseMoveAbsPx().parameters;
      return mouseMoveParams;
    } else if (isClickMouseAction(action)) {
      return this.builtinFnsProvider.getMouseClick().parameters;
    } else if (isHoldReleaseMouseAction(action)) {
      return this.builtinFnsProvider.getMouseHoldRelease().parameters;
    } else {
      throw new ExhaustivenessFailureError(action);
    }
  }

  private extractEnum(
    actionValue: EnterEnumActionValue | VariableEnumActionValue
  ): PrintableValue {
    if (isVariableActionValue(actionValue)) {
      return this.wrapActionValue(actionValue);
    }
    return {
      type: PrintableValueType.STRING_VALUE,
      value: actionValue.value.toLowerCase().replaceAll(' ', ''),
    };
  }
}
