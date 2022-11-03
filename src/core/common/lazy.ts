import { isSome, Maybe, none } from './maybe';

export const findFirst = <A, B>(arr: A[], fn: (a: A) => Maybe<B>): Maybe<B> => {
  for (const a of arr) {
    const result = fn(a);
    if (isSome(result)) {
      return result;
    }
  }
  return none();
};
