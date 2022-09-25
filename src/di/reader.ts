/**
 * the reader monad
 *
 * @param env the environment: dependencies to be injected later
 */
export type Reader<E, R> = (env: E) => R;
