import { SleightDataInternalFormat } from '../../../../data-formats';
import { Fn, FnParameter } from '../../../../model/fn/fn';
import { VariableType } from '../../../../model/variable/variable-types';
import { Printer } from '../../../printer';
import { getNegativizerTokenForFnParameter } from './negativizer-utils';

const enum PrintParamMode {
  EXECUTION,
  SIGNATURE,
}

export class DefaultDragonflyNegativizerFnWrapperPrinter
  implements Printer<Fn>
{
  printItem(fn: Fn, _data: SleightDataInternalFormat): string {
    const lines: string[] = [];

    // fn name
    const signature: string[] = [];
    signature.push(`def wrap_${fn.name}(`);

    // fn params
    signature.push(this.printParams(fn.parameters, PrintParamMode.SIGNATURE));
    signature.push('):');
    lines.push(signature.join(''));

    // negativizer sign conversion
    for (const param of fn.parameters) {
      if (param.type === VariableType.Enum.NUMBER) {
        const fnParamName = param.name;
        const nFnParamName = getNegativizerTokenForFnParameter(param);
        const conversion = `${fnParamName} = sign(${fnParamName}, ${nFnParamName})`;
        lines.push(this.indent(conversion));
      }
    }

    // actual fn call
    const origParams = this.printParams(
      fn.parameters,
      PrintParamMode.EXECUTION
    );
    const func = `Function(${fn.name}, ${origParams}).execute()`;
    lines.push(this.indent(func));

    return lines.join('\n');
  }

  private indent(value: string): string {
    return `    ${value}`;
  }

  private printParams(params: FnParameter[], mode: PrintParamMode): string {
    const originalParams: string[] = [];
    const negativizerParams: string[] = [];
    for (const param of params) {
      // default Python params can't come before non-default, so add these later
      originalParams.push(param.name);
      if (param.type === VariableType.Enum.NUMBER) {
        negativizerParams.push(getNegativizerTokenForFnParameter(param));
      }
    }

    const args: string[] = [];
    switch (mode) {
      case PrintParamMode.EXECUTION:
        for (const orig of originalParams) {
          args.push(`${orig}=${orig}`);
        }
        break;
      case PrintParamMode.SIGNATURE:
        for (const orig of originalParams) {
          args.push(orig);
        }
        for (const nParamName of negativizerParams) {
          args.push(`${nParamName}=None`);
        }
        break;
    }
    return args.join(', ');
  }
}
