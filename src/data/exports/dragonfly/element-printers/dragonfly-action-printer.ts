import { NotImplementedError } from '../../../../error/not-implemented-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { ElementPrinter } from './element-printer';

export class DragonflyActionPrinter implements ElementPrinter<Action> {
  printElement(element: Action, data: SleightDataInternalFormat): string {
    throw new NotImplementedError('DragonflyActionPrinter');
  }
}
