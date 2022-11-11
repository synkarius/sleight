import { MapUtil } from '../../../../core/common/map-util';
import { NotImplementedError } from '../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { Command } from '../../../model/command/command';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { Printer } from '../../printer';

export class DragonflyCommandPrinter implements Printer<Command> {
  constructor(
    private specPrinter: Printer<SpecDTO>,
    private actionPrinter: Printer<Action>
  ) {}

  printItem(command: Command, data: SleightDataInternalFormat): string {
    //
    const spec = MapUtil.getOrThrow(data.specs, command.specId);
    const printedSpec = this.specPrinter.printItem(spec, data);
    //
    const actions = command.actionIds.map((actionId) =>
      MapUtil.getOrThrow(data.actions, actionId)
    );
    const printedActions =
      actions
        .map((action) => this.actionPrinter.printItem(action, data))
        .join(' + ') || 'Function(do_nothing)';
    //
    return printedSpec + ' : ' + printedActions + ',';
  }
}
