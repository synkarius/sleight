import { SleightDataInternalFormat } from '../data-formats';
import { Preferences } from '../preferences/preferences';

export type Printer<I> = {
  printItem: (
    item: I,
    data: SleightDataInternalFormat,
    prefs: Preferences
  ) => string;
};
