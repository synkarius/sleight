import { SleightDataInternalFormat } from '../data-formats';
import { Preferences } from '../preferences/preferences';

export type Exporter = {
  readonly export: (
    data: SleightDataInternalFormat,
    prefs: Preferences
  ) => string[];
};
