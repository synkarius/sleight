import { getRandomId } from '../util/functions';

export interface RoleKeyed {
  roleKeyId: string | null;
}

export interface Ided {
  id: string;
}

export interface Named {
  name: string;
}

export interface Typed {
  type: string;
}

export interface BasicFields extends RoleKeyed, Ided, Named, Typed {}
