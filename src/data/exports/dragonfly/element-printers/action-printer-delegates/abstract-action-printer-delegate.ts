import { isEmpty } from '../../../../../core/common/common-functions';
import { Maybe } from '../../../../../core/common/maybe';
import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { ElementType } from '../../../../model/element-types';
import { VariableType } from '../../../../model/variable/variable-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import {
  DragonflyActionValueResolverResult,
  DragonflyActionValueResolverResultType,
  DragonflyActionValueResolverVariableResult,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export abstract class AbstractDragonflyActionPrinterDelegate
  implements DragonflyActionPrinterDelegate
{
  constructor(private elementTokenPrinter: ElementTokenPrinter) {}

  abstract printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): Maybe<string>;

  resultToArg(result: DragonflyActionValueResolverResult): string {
    return this.resultIsVariableType(result)
      ? this.resultToDFStrInterp(result)
      : result.value;
  }

  resultIsVariableType(
    result: DragonflyActionValueResolverResult
  ): result is DragonflyActionValueResolverVariableResult {
    return result.type === DragonflyActionValueResolverResultType.USE_VARIABLE;
  }

  /** Converts result to Dragonfly interpolation string. */
  resultToDFStrInterp(
    result: DragonflyActionValueResolverVariableResult
  ): string {
    return (
      `%(${this.printVariableActionValueName(result)})` +
      this.resultStrInterpSuffix(result)
    );
  }

  printVariableActionValueName(
    result: DragonflyActionValueResolverVariableResult
  ): string {
    return this.elementTokenPrinter.printElementToken(
      result.variableId,
      ElementType.Enum.VARIABLE
    );
  }

  resultStrInterpSuffix(
    result: DragonflyActionValueResolverVariableResult
  ): string {
    const variableType = result.variableType;
    switch (variableType) {
      case VariableType.Enum.TEXT:
      case VariableType.Enum.ENUM:
        return 's';
      case VariableType.Enum.NUMBER:
        return 'd';
      default:
        throw new ExhaustivenessFailureError(variableType);
    }
  }

  resultIsEmpty(result: DragonflyActionValueResolverResult): boolean {
    const resultType = result.type;
    switch (resultType) {
      case DragonflyActionValueResolverResultType.USE_VARIABLE:
        return isEmpty(result.variableId);
      default:
        return isEmpty(result.value);
    }
  }
}
