import { MapKeyMissingError } from '../error/map-key-missing-error';

export namespace MapUtil {
  /** Use this if it should be possible for a key to be missing. */
  export const get = <T>(
    map: Readonly<Record<string, T>>,
    key: string
  ): T | undefined => {
    return map[key];
  };
  /** Use this if it should NOT be possible for a key to be missing. */
  export const getOrThrow = <T>(
    map: Readonly<Record<string, T>>,
    key: string
  ): T => {
    const value: T | undefined = get(map, key);
    if (value) {
      return value;
    }
    throw new MapKeyMissingError(key);
  };
}
