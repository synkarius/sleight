import { Maybe } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';

export type DragonflyActionPrinterDelegate = {
  printAction: (
    action: Action,
    data: SleightDataInternalFormat
  ) => Maybe<string>;
};
