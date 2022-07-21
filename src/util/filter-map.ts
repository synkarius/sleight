/**
 * `FilterMap` is a tool which pairs a condition for transforming an `A` to a `B`
 * with the logic of the transformation. It is a "filter" operation paired with
 * a "map" operation.
 *
 * FilterMaps are composable through `FilterMapBuilder`.
 */
interface FilterMap<A, B> {
  filter: (a: A) => boolean;
  map: (a: A) => B;
}

interface FilterMapBuilder<A, B> {
  withFilterMap: <C>(filterMap: FilterMap<B, C>) => FilterMapBuilder<A, C>;
  build: () => FilterMap<A, B>;
}

export const newFilterMapBuilder = <A, B>(
  base: FilterMap<A, B>
): FilterMapBuilder<A, B> => {
  return {
    withFilterMap: <C>(other: FilterMap<B, C>): FilterMapBuilder<A, C> => {
      const combinedFilter = (t1: A) => {
        if (base.filter(t1)) {
          const t2: B = base.map(t1);
          return other.filter(t2);
        }
        return false;
      };
      const combinedMap = (t1: A): C => {
        return other.map(base.map(t1));
      };
      return newFilterMapBuilder({
        filter: combinedFilter,
        map: combinedMap,
      });
    },
    build: (): FilterMap<A, B> => {
      return base;
    },
  };
};

export const createFilterMap = <A, B>(
  filter: (a: A) => boolean,
  map: (a: A) => B
): FilterMap<A, B> => {
  return {
    filter: filter,
    map: map,
  };
};
