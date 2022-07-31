export interface DomainMapper<D, O> {
  mapToDomain: (other: O) => D;
  mapFromDomain: (domain: D) => O;
}

/**
 * Convenience mapper factory for when the domain type
 * and other type perfectly overlap.
 */
export const createCloneMapper = <T>(): DomainMapper<T, T> => {
  return {
    mapToDomain: (other: T): T => {
      return structuredClone(other);
    },
    mapFromDomain: (domain: T): T => {
      return structuredClone(domain);
    },
  };
};
