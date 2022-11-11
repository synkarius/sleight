import { SleightDataInternalFormat } from '../data-formats';

export type Printer<I> = {
  printItem: (item: I, data: SleightDataInternalFormat) => string;
};
