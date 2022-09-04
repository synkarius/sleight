import { Ided } from '../../../domain';

export interface SelectorItemDTO extends Ided {
  readonly value: string;
}

export interface SelectorDTO extends Ided {
  readonly items: SelectorItemDTO[];
}
