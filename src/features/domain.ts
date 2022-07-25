export interface RoleKeyed {
  readonly roleKeyId: string | null;
}

export interface Ided {
  readonly id: string;
}

export interface Named {
  readonly name: string;
}

export interface Typed<T> {
  readonly type: T;
}

export interface BasicFields<T> extends RoleKeyed, Ided, Named, Typed<T> {}
