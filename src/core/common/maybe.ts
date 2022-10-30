const enum MaybeType {
  SOME,
  NONE,
}

type Some<T> = {
  type: MaybeType.SOME;
  value: T;
};

type None = {
  type: MaybeType.NONE;
};

export type Maybe<T> = Some<T> | None;

export const isSome = <T>(maybe: Maybe<T>): maybe is Some<T> =>
  maybe.type === MaybeType.SOME;

export const some = <T>(value: T): Some<T> => ({ type: MaybeType.SOME, value });

export const none = (): None => ({ type: MaybeType.NONE });

export const maybe = <T>(value?: T): Maybe<T> => (value ? some(value) : none());
