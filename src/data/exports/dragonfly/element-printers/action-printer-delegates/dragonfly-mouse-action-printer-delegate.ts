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
import { VariableType } from '../../../../model/variable/variable-types';
import {
  EnterEnumActionValue,
  isVariableActionValue,
  VariableEnumActionValue,
} from '../../../../model/action/action-value';

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
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(actionValueResolver, elementTokenPrinter);
  }

  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isMouseAction(action)) {
      const avParams = this.getPrintableValues(action);
      const fnParams = this.getFnParameters(action);
      const executeMouse: PythonFn = {
        id: '',
        name: 'execute_mouse',
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

  private getPrintableValues(mouseAction: MouseAction): PrintableValue[] {
    const mouseActionType = mouseAction.mouseActionType;
    switch (mouseActionType) {
      case MouseActionType.Enum.MOVE:
        return [
          {
            type: PrintableValueType.CALCULATED_STRING_VALUE,
            value: mouseAction.mouseMovementType,
          },
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
      return [
        {
          id: '',
          name: 'movement_type',
          type: VariableType.Enum.ENUM,
        },
        {
          id: '',
          name: 'x',
          type: VariableType.Enum.NUMBER,
        },
        {
          id: '',
          name: 'y',
          type: VariableType.Enum.NUMBER,
        },
      ];
    } else if (isClickMouseAction(action)) {
      return [
        {
          id: '',
          name: 'button',
          type: VariableType.Enum.ENUM,
        },
        {
          id: '',
          name: 'repeat',
          type: VariableType.Enum.NUMBER,
        },
        {
          id: '',
          name: 'pause',
          type: VariableType.Enum.NUMBER,
        },
      ];
    } else if (isHoldReleaseMouseAction(action)) {
      return [
        {
          id: '',
          name: 'button',
          type: VariableType.Enum.ENUM,
        },
        {
          id: '',
          name: 'direction',
          type: VariableType.Enum.ENUM,
        },
        {
          id: '',
          name: 'pause',
          type: VariableType.Enum.NUMBER,
        },
      ];
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
      type: PrintableValueType.CALCULATED_STRING_VALUE,
      value: actionValue.value.toLowerCase().replaceAll(' ', ''),
    };
  }
}
