import { SleightDataFormat } from '../json-format';

export type Exporter = {
  readonly export: (data: Omit<SleightDataFormat, 'version'>) => string[];
};
