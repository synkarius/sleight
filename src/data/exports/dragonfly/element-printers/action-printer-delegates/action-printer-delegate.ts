import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';

export type DragonflyActionPrinterDelegate = {
  printAction: (
    action: Action,
    data: SleightDataInternalFormat
  ) => string | undefined;
};
