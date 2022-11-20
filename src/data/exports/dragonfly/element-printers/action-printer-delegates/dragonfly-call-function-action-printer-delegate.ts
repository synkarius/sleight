import { MapUtil } from '../../../../../core/common/map-util';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { NotImplementedError } from '../../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import { FnType } from '../../../../model/fn/fn-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { DragonflyNegativizerPrinter } from '../negativizer/dragonfly-negativizer-printer-augmenter';
import { AbstractDragonflyActionAsFunctionPrinterDelegate } from './abstract-dragonfly-action-as-function-printer-delegate';

export class DragonflyCallFunctionPrinter extends AbstractDragonflyActionAsFunctionPrinterDelegate {
  constructor(
    actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter,
    negativizerAugmenter: DragonflyNegativizerPrinter
  ) {
    super(actionValueResolver, elementTokenPrinter, negativizerAugmenter);
  }

  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isCallFunctionAction(action)) {
      const fn = MapUtil.getOrThrow(data.fns, action.functionId);
      if (fn.type !== FnType.Enum.PYTHON) {
        throw new NotImplementedError('fnType: ' + fn.type);
      }

      const wrapped = action.parameters.map((p) => this.wrapActionValue(p));

      return some(this.printActionAsFunction(wrapped, fn, data));
    }
    return none();
  }
}
