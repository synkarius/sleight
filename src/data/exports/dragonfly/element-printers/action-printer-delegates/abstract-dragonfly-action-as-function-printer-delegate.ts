import { quote } from '../../../../../core/common/common-functions';
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
import { SleightDataInternalFormat } from '../../../../data-formats';
import { ActionValue } from '../../../../model/action/action-value';
import { ActionValueType } from '../../../../model/action/action-value-type';
import { Fn, FnParameter } from '../../../../model/fn/fn';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import {
  isPrintableActionValue,
  isPrintableCalculatedStringValue,
  PrintableValue,
  PrintableValueType,
} from '../../../printable-value';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { AbstractDragonflyActionPrinterDelegate } from './abstract-action-printer-delegate';

export abstract class AbstractDragonflyActionAsFunctionPrinterDelegate extends AbstractDragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(elementTokenPrinter);
  }

  printActionAsFunction(
    actionValues: PrintableValue[],
    fn: Fn,
    data: SleightDataInternalFormat
  ): string {
    const matched = this.matchParams(actionValues, fn.parameters);
    const sorted = this.sortParams(matched);

    const args: string[] = [fn.name];

    if (!!sorted.variableValues.length) {
      const dict = [];
      for (const v of sorted.variableValues) {
        if (!isPrintableActionValue(v.avParam)) {
          throw new ExportError('sort failed (printActionAsFunction/variable)');
        }
        const result = this.actionValueResolver.resolve(
          v.avParam.actionValue,
          data
        );
        if (!this.resultIsEmpty(result) && this.resultIsVariableType(result)) {
          const avName = this.printVariableActionValueName(result);
          dict.push(`${avName}="${v.fnParam.name}"`);
        }
      }
      args.push(['dict(', dict.join(', '), ')'].join(''));
    }

    for (const ev of sorted.staticValues) {
      let arg: Maybe<string> = none();
      const paramName = `${ev.fnParam.name}=`;
      const dontQuote = ev.fnParam.type === VariableType.Enum.NUMBER;
      if (isPrintableActionValue(ev.avParam)) {
        const result = this.actionValueResolver.resolve(
          ev.avParam.actionValue,
          data
        );
        if (!this.resultIsEmpty(result)) {
          arg = some(this.resultToArg(result));
        }
      } else if (isPrintableCalculatedStringValue(ev.avParam)) {
        arg = some(ev.avParam.value);
      }
      if (!isSome(arg)) {
        throw new ExportError('empty arg (printActionAsFunction/static)');
      }
      args.push(paramName + (dontQuote ? arg.value : quote(arg.value)));
    }

    return ['Function(', args.join(', '), ')'].join('');
  }

  private matchParams(
    printables: PrintableValue[],
    fnParams: FnParameter[]
  ): Parameter[] {
    const result: Parameter[] = [];
    for (let i = 0; i < printables.length; i++) {
      const maybeFnParam: Maybe<FnParameter> = maybe(fnParams[i]);
      const avParam: PrintableValue = printables[i];
      if (isNone(maybeFnParam)) {
        throw new ExportError(
          'Fn params length does not match action values length'
        );
      }
      const fnParam = maybeFnParam.value;
      result.push({ fnParam, avParam });
    }
    return result;
  }

  private sortParams(params: Parameter[]): ParamGroups {
    const result: ParamGroups = {
      staticValues: [],
      variableValues: [],
    };
    for (const param of params) {
      if (isPrintableActionValue(param.avParam)) {
        const actionValueType = param.avParam.actionValue.actionValueType;
        switch (actionValueType) {
          case ActionValueType.Enum.ENTER_VALUE:
            result.staticValues.push(param);
            break;
          case ActionValueType.Enum.USE_VARIABLE:
            result.variableValues.push(param);
            break;
          default:
            throw new ExhaustivenessFailureError(actionValueType);
        }
      } else if (isPrintableCalculatedStringValue(param.avParam)) {
        result.staticValues.push(param);
      } else {
        throw new ExportError('invalid printable param type (sortParams)');
      }
    }
    return result;
  }

  wrapActionValue(actionValue: ActionValue): PrintableValue {
    return {
      type: PrintableValueType.ACTION_VALUE,
      actionValue,
    };
  }
}

type ParamGroups = {
  staticValues: Parameter[];
  variableValues: Parameter[];
};

type Parameter = {
  fnParam: FnParameter;
  avParam: PrintableValue;
};
