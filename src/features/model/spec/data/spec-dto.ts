import { Ided, Named, RoleKeyed } from '../../../domain';
import { SpecItemType } from '../spec-item-type';

export interface SpecItemDTO extends Ided {
  readonly itemId: string;
  readonly itemType: SpecItemType.Type;
}

export interface SpecDTO extends Ided, Named, RoleKeyed {
  readonly items: SpecItemDTO[];
}
