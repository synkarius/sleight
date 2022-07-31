import { ReduxFriendlyStringMap } from '../util/string-map';

export type ReduxCopyFunction<T> = (id: string) => T;

export const wrapReduxMap = <T>(
  savedMap: ReduxFriendlyStringMap<T>
): ReduxCopyFunction<T> => {
  return (id: string): T => {
    if (savedMap[id]) {
      return { ...savedMap[id] };
    }
    throw new Error('todo this error');
  };
};
