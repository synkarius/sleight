import { SleightDataInternalFormat } from '../../data-formats';
import { createMustacheFn, MustacheFn } from '../util-mustache-fns';
import { MapUtil } from '../../../core/common/map-util';
import { Printer } from '../printer';
import { Action } from '../../model/action/action';
import { Command } from '../../model/command/command';
import { Context } from '../../model/context/context';
import { SpecDTO } from '../../model/spec/spec-dto';
import { VariableDTO } from '../../model/variable/variable-dto';
import { Fn } from '../../model/fn/fn';

export type DragonflyMustacheFns = {
  printAction: () => MustacheFn;
  printCommand: () => MustacheFn;
  printContext: () => MustacheFn;
  printFnImport: () => MustacheFn;
  printSpec: () => MustacheFn;
  printVariable: () => MustacheFn;
  printDefault: () => MustacheFn;
};

export type DragonflyMustacheFnsFactory = {
  getDragonflyMustacheFns: (
    data: SleightDataInternalFormat
  ) => DragonflyMustacheFns;
};

export class DefaultDragonflyMustacheFnsFactory
  implements DragonflyMustacheFnsFactory
{
  constructor(
    private actionPrinter: Printer<Action>,
    private commandPrinter: Printer<Command>,
    private contextPrinter: Printer<Context>,
    private fnImportPrinter: Printer<Fn>,
    private specPrinter: Printer<SpecDTO>,
    private variablePrinter: Printer<VariableDTO>,
    private defaultPrinter: Printer<VariableDTO>
  ) {}

  getDragonflyMustacheFns(
    data: SleightDataInternalFormat
  ): DragonflyMustacheFns {
    return {
      printAction: createMustacheFn((id, r) => {
        const action = MapUtil.getOrThrow(data.actions, r(id));
        return this.actionPrinter.printItem(action, data);
      }),
      printCommand: createMustacheFn((id, r) => {
        const command = MapUtil.getOrThrow(data.commands, r(id));
        return this.commandPrinter.printItem(command, data);
      }),
      printContext: createMustacheFn((id, r) => {
        const context = MapUtil.getOrThrow(data.contexts, r(id));
        return this.contextPrinter.printItem(context, data);
      }),
      printFnImport: createMustacheFn((id, r) => {
        const fn = MapUtil.getOrThrow(data.fns, r(id));
        return this.fnImportPrinter.printItem(fn, data);
      }),
      printSpec: createMustacheFn((id, r) => {
        const spec = MapUtil.getOrThrow(data.specs, r(id));
        return this.specPrinter.printItem(spec, data);
      }),
      printVariable: createMustacheFn((id, r) => {
        const variable = MapUtil.getOrThrow(data.variables, r(id));
        return this.variablePrinter.printItem(variable, data);
      }),
      printDefault: createMustacheFn((id, r) => {
        const variable = MapUtil.getOrThrow(data.variables, r(id));
        return this.defaultPrinter.printItem(variable, data);
      }),
    };
  }
}
