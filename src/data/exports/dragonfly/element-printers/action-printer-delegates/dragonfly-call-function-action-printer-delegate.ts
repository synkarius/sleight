import { quote } from '../../../../../core/common/common-functions';
import { MapUtil } from '../../../../../core/common/map-util';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { NotImplementedError } from '../../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isCallFunctionAction } from '../../../../model/action/call-function/call-function';
import { FnType } from '../../../../model/fn/fn-types';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  DragonflyActionValueResolverResultType,
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

  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
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
          const dontQuote =
            fnParam.type === VariableType.Enum.NUMBER &&
            result.type !== DragonflyActionValueResolverResultType.USE_VARIABLE;
          args.push(paramName + (dontQuote ? arg : quote(arg)));
        }
      }
      return some(['Function(', args.join(', '), ')'].join(''));
    }
    return none();
  }
}
