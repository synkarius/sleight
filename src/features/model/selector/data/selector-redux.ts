import { RoleKeyed, Ided } from '../../../domain';

export interface SelectorItemRedux extends RoleKeyed, Ided {
  readonly value: string;
}

export interface SelectorRedux extends RoleKeyed, Ided {
  readonly items: SelectorItemRedux[];
}
