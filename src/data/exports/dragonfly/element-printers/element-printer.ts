import { SleightDataInternalFormat } from '../../../data-formats';

export type ElementPrinter<E> = {
  printElement: (element: E, data: SleightDataInternalFormat) => string;
};
