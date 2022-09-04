export interface Ided {
  readonly id: string;
}

export interface Named {
  readonly name: string;
}

export interface RoleKeyed {
  readonly roleKey: string;
}

export interface Typed<T> {
  readonly type: T;
}

export interface BasicFields<T> extends Ided, Named, RoleKeyed, Typed<T> {}
