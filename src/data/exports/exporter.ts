import { SleightDataInternalFormat } from '../data-formats';

export type Exporter = {
  readonly export: (data: SleightDataInternalFormat) => string[];
};
