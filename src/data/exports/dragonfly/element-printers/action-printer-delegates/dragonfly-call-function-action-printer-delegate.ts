import { quote } from '../../../../../core/common/common-functions';
import { MapUtil } from '../../../../../core/common/map-util';
import { NotImplementedError } from '../../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import { FnType } from '../../../../model/fn/fn-types';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  resultIsEmpty,
  resultToArg,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyCallFunctionPrinter
  implements DragonflyActionPrinterDelegate
{
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementTokenPrinter: ElementTokenPrinter
  ) {}

  printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): string | undefined {
    if (isCallFunctionAction(action)) {
      const fn = MapUtil.getOrThrow(data.fns, action.functionId);
      if (fn.type !== FnType.Enum.PYTHON) {
        throw new NotImplementedError('fnType: ' + fn.type);
      }

      const args: string[] = [];
      for (let i = 0; i < action.parameters.length; i++) {
        const fnParam = fn.parameters[i];
        const avParam = action.parameters[i];

        const result = this.actionValueResolver.resolve(avParam, data);
        if (!resultIsEmpty(result)) {
          const paramName = `${fnParam.name}=`;
          const arg = resultToArg(result)(this.elementTokenPrinter);
          args.push(
            paramName +
              (fnParam.type === VariableType.Enum.NUMBER ? arg : quote(arg))
          );
        }
      }
      return ['Function(', args.join(', '), ')'].join('');
    }
  }
}
