import { MapKeyMissingError } from '../../error/map-key-missing-error';
import { isSome, maybe, Maybe } from './maybe';

export namespace MapUtil {
  /** Use this if it should be possible for a key to be missing. */
  export const get = <T>(
    map: Readonly<Record<string, T>>,
    key: string
  ): Maybe<T> => {
    return maybe(map[key]);
  };
  /** Use this if it should NOT be possible for a key to be missing. */
  export const getOrThrow = <T>(
    map: Readonly<Record<string, T>>,
    key: string
  ): T => {
    const maybe: Maybe<T> = get(map, key);
    if (isSome(maybe)) {
      return maybe.value;
    }
    throw new MapKeyMissingError(key);
  };
}
