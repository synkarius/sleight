/** Enables export of an element. */
export interface Enablable {
  readonly enabled: boolean;
}

export interface Ided {
  readonly id: string;
}

/** Blocks import override of an element by role key. */
export interface Lockable {
  readonly locked: boolean;
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
