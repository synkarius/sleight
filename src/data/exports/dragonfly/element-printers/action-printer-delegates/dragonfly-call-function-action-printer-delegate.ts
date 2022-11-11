import { quote } from '../../../../../core/common/common-functions';
import { MapUtil } from '../../../../../core/common/map-util';
import {
  isNone,
  isSome,
  maybe,
  Maybe,
  none,
  some,
} from '../../../../../core/common/maybe';
import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { ExportError } from '../../../../../error/export-error';
import { NotImplementedError } from '../../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { ActionValue } from '../../../../model/action/action-value';
import { ActionValueType } from '../../../../model/action/action-value-type';
import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import { Fn, FnParameter } from '../../../../model/fn/fn';
import { FnType } from '../../../../model/fn/fn-types';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { AbstractDragonflyActionPrinterDelegate } from './abstract-action-printer-delegate';
import { AbstractDragonflyActionAsFunctionPrinterDelegate } from './abstract-dragonfly-action-as-function-printer-delegate';

export class DragonflyCallFunctionPrinter extends AbstractDragonflyActionAsFunctionPrinterDelegate {
  constructor(
    actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(actionValueResolver, elementTokenPrinter);
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
