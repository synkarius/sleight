export interface DefaultNamer<T> {
  getDefaultName: (t: T) => string;
}
