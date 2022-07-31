import { Ided, Named, RoleKeyed } from '../../../domain';
import { SpecItemType } from '../spec-item-type';

export interface SpecItemRedux extends Ided {
  readonly itemId: string;
  readonly itemType: SpecItemType.Type;
}

export interface SpecRedux extends Ided, Named, RoleKeyed {
  readonly items: SpecItemRedux[];
}
