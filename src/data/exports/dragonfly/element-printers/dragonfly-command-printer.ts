import { MapUtil } from '../../../../core/common/map-util';
import { NotImplementedError } from '../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { Command } from '../../../model/command/command';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { ElementPrinter } from './element-printer';

/** not sure this is even needed yet */
export class DragonflyCommandPrinter implements ElementPrinter<Command> {
  constructor(
    private specPrinter: ElementPrinter<SpecDTO>,
    private actionPrinter: ElementPrinter<Action>
  ) {}

  printElement(command: Command, data: SleightDataInternalFormat): string {
    //
    const spec = MapUtil.getOrThrow(data.specs, command.specId);
    const printedSpec = this.specPrinter.printElement(spec, data);
    //
    const actions = command.actionIds.map((actionId) =>
      MapUtil.getOrThrow(data.actions, actionId)
    );
    const printedActions = actions
      .map((action) => this.actionPrinter.printElement(action, data))
      .join(' + ');
    //
    return printedSpec + ' : ' + printedActions + ',';
  }
}
