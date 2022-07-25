export interface RoleKeyed {
  roleKeyId: string | null;
}

export interface Ided {
  id: string;
}

export interface Named {
  name: string;
}

export interface Typed<T> {
  type: T;
}

export interface BasicFields<T> extends RoleKeyed, Ided, Named, Typed<T> {}
