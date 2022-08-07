import { RoleKeyed, Ided } from '../../../domain';

export interface SelectorItemDTO extends RoleKeyed, Ided {
  readonly value: string;
}

export interface SelectorDTO extends RoleKeyed, Ided {
  readonly items: SelectorItemDTO[];
}
