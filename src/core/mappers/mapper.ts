export interface DomainMapper<D, O> {
  mapToDomain: (other: O) => D;
  mapFromDomain: (domain: D) => O;
}
