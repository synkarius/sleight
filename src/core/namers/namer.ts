export interface Namer<T> {
  getName: (t: T) => string;
}
