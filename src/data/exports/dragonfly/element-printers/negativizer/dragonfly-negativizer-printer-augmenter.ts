import { MapUtil } from '../../../../../core/common/map-util';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { FnParameter } from '../../../../model/fn/fn';
import { ElementTokenPrinter } from '../../../element-token-printer';
import {
  getNegativizerTokenForFnParameter,
  getNegativizerTokenForVariable,
  requiresNegativizer,
} from './negativizer-utils';

type NegativizerAugment = (
  variableId: string,
  data: SleightDataInternalFormat
) => Maybe<string>;

/** Since 4 separate printers are required to make this feature work,
 * it seems like it might be best to keep the actual printing logic
 * together in one class/type.
 */
export type DragonflyNegativizerPrinter = {
  printForSpec: NegativizerAugment;
  printForDict: (
    variableId: string,
    fnParam: FnParameter,
    data: SleightDataInternalFormat
  ) => Maybe<string>;
  printForExtras: NegativizerAugment;
  printForDefaults: NegativizerAugment;
};

export class DefaultDragonflyNegativizerPrinter
  implements DragonflyNegativizerPrinter
{
  constructor(private elementTokenPrinter: ElementTokenPrinter) {}

  printForSpec(
    variableId: string,
    data: SleightDataInternalFormat
  ): Maybe<string> {
    return this.shouldAugment(variableId, data)
      ? some(`[<${this.getVarNToken(variableId)}>]`)
      : none();
  }

  printForDict(
    variableId: string,
    fnParam: FnParameter,
    data: SleightDataInternalFormat
  ): Maybe<string> {
    return this.shouldAugment(variableId, data)
      ? some(
          `${this.getVarNToken(variableId)}="${this.getFnParamNToken(fnParam)}"`
        )
      : none();
  }

  printForExtras(
    variableId: string,
    data: SleightDataInternalFormat
  ): Maybe<string> {
    return this.shouldAugment(variableId, data)
      ? some(`RuleRef(negativizer_rule, "${this.getVarNToken(variableId)}")`)
      : none();
  }

  printForDefaults(
    variableId: string,
    data: SleightDataInternalFormat
  ): Maybe<string> {
    return this.shouldAugment(variableId, data)
      ? some(`"${this.getVarNToken(variableId)}": "+"`)
      : none();
  }

  private getVarNToken(variableId: string): string {
    return getNegativizerTokenForVariable(variableId)(this.elementTokenPrinter);
  }

  private getFnParamNToken(fnParameter: FnParameter): string {
    return getNegativizerTokenForFnParameter(fnParameter);
  }

  private shouldAugment(
    variableId: string,
    data: SleightDataInternalFormat
  ): boolean {
    const variable = MapUtil.getOrThrow(data.variables, variableId);
    return requiresNegativizer(variable);
  }
}
