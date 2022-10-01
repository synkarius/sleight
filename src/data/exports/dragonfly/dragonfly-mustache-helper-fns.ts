import { SleightDataInternalFormat } from '../../data-formats';
import { createMustacheFn, MustacheFn } from '../util-mustache-fns';
import { NotImplementedError } from '../../../error/not-implemented-error';
import { MapUtil } from '../../../core/common/map-util';
import { ElementPrinter } from './element-printers/element-printer';
import { Action } from '../../model/action/action';
import { Command } from '../../model/command/command';
import { Context } from '../../model/context/context';
import { SpecDTO } from '../../model/spec/spec-dto';
import { VariableDTO } from '../../model/variable/variable-dto';

export type DragonflyMustacheFns = {
  printAction: () => MustacheFn;
  printCommand: () => MustacheFn;
  printContext: () => MustacheFn;
  printSpec: () => MustacheFn;
  printVariable: () => MustacheFn;
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
    private actionPrinter: ElementPrinter<Action>,
    private commandPrinter: ElementPrinter<Command>,
    private contextPrinter: ElementPrinter<Context>,
    private specPrinter: ElementPrinter<SpecDTO>,
    private variablePrinter: ElementPrinter<VariableDTO>
  ) {}

  getDragonflyMustacheFns(
    data: SleightDataInternalFormat
  ): DragonflyMustacheFns {
    return {
      printAction: createMustacheFn((id, r) => {
        const action = MapUtil.getOrThrow(data.actions, r(id));
        return this.actionPrinter.printElement(action, data);
      }),
      printCommand: createMustacheFn((id, r) => {
        const command = MapUtil.getOrThrow(data.commands, r(id));
        return this.commandPrinter.printElement(command, data);
      }),
      printContext: createMustacheFn((id, r) => {
        const context = MapUtil.getOrThrow(data.contexts, r(id));
        return this.contextPrinter.printElement(context, data);
      }),
      printSpec: createMustacheFn((id, r) => {
        const spec = MapUtil.getOrThrow(data.specs, r(id));
        return this.specPrinter.printElement(spec, data);
      }),
      printVariable: createMustacheFn((id, r) => {
        const variable = MapUtil.getOrThrow(data.variables, r(id));
        return this.variablePrinter.printElement(variable, data);
      }),
    };
  }
}
