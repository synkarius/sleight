import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isPauseAction } from '../../../../model/action/pause/pause';
import { PythonFn } from '../../../../model/fn/fn';
import { FnType } from '../../../../model/fn/fn-types';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { AbstractDragonflyActionAsFunctionPrinterDelegate } from './abstract-dragonfly-action-as-function-printer-delegate';

export class DragonflyPausePrinter extends AbstractDragonflyActionAsFunctionPrinterDelegate {
  constructor(
    actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(actionValueResolver, elementTokenPrinter);
  }

  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isPauseAction(action)) {
      const executePause: PythonFn = {
        id: '',
        name: 'execute_pause',
        roleKey: '',
        type: FnType.Enum.PYTHON,
        enabled: true,
        locked: true,
        importTokens: [],
        parameters: [
          {
            id: '',
            name: 'seconds',
            type: VariableType.Enum.NUMBER,
          },
        ],
      };
      return some(
        this.printActionAsFunction(
          [this.wrapActionValue(action.seconds)],
          executePause,
          data
        )
      );
    }
    return none();
  }
}
