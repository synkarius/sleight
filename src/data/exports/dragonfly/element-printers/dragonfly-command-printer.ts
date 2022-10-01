import { NotImplementedError } from '../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { Command } from '../../../model/command/command';
import { ElementPrinter } from './element-printer';

/** not sure this is even needed yet */
export class DragonflyCommandPrinter implements ElementPrinter<Command> {
  printElement(element: Command, data: SleightDataInternalFormat): string {
    throw new NotImplementedError('DragonflyCommandPrinter');
  }
}
