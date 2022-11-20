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
import { SleightDataInternalFormat } from '../../../../data-formats';
import {
  ActionValue,
  isVariableActionValue,
  isVariableNumberActionValue,
} from '../../../../model/action/action-value';
import { ActionValueType } from '../../../../model/action/action-value-type';
import { Fn, FnParameter } from '../../../../model/fn/fn';
import { isRangeVariable } from '../../../../model/variable/variable';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import {
  isPrintableActionValue,
  isPrintableStringValue,
  PrintableValue,
  PrintableValueType,
} from '../../../printable-value';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { DragonflyNegativizerPrinter } from '../negativizer/dragonfly-negativizer-printer-augmenter';
import { requiresNegativizer } from '../negativizer/negativizer-utils';
import { AbstractDragonflyActionPrinterDelegate } from './abstract-action-printer-delegate';

export abstract class AbstractDragonflyActionAsFunctionPrinterDelegate extends AbstractDragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter,
    private negativizerAugmenter: DragonflyNegativizerPrinter
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

    // TODO: supply wrapper fns for printing to exporter
    // right now, those should only be the builtin mouse fns and any CFA fn

    const fnName = this.calculateFnName(sorted, fn, data);
    const args: string[] = [fnName];

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

          if (
            isVariableActionValue(v.avParam.actionValue) &&
            isVariableNumberActionValue(v.avParam.actionValue)
          ) {
            const maybeNegativizer = this.negativizerAugmenter.printForDict(
              v.avParam.actionValue.variableId,
              v.fnParam,
              data
            );
            if (isSome(maybeNegativizer)) {
              dict.push(maybeNegativizer.value);
            }
          }
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
      } else if (isPrintableStringValue(ev.avParam)) {
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
      } else if (isPrintableStringValue(param.avParam)) {
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

  private calculateFnName(
    sorted: ParamGroups,
    fn: Fn,
    data: SleightDataInternalFormat
  ): string {
    const wrapperFnRequired = !!sorted.variableValues
      .map((vv) => vv.avParam)
      .filter(isPrintableActionValue)
      .map((avp) => avp.actionValue)
      .filter(isVariableActionValue)
      .map((av) => av.variableId)
      .map((variableId) => MapUtil.getOrThrow(data.variables, variableId))
      .find(requiresNegativizer);
    return wrapperFnRequired ? `wrap_${fn.name}` : fn.name;
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
