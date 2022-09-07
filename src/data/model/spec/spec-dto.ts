import { Enablable, Ided, Lockable, Named, RoleKeyed } from '../domain';
import { SpecItemType } from './spec-item-type';

export interface SpecItemDTO extends Ided {
  readonly itemId: string;
  readonly itemType: SpecItemType.Type;
  readonly optional: boolean;
  readonly grouped: boolean;
}

export interface SpecDTO extends Enablable, Ided, Lockable, Named, RoleKeyed {
  readonly items: SpecItemDTO[];
}
