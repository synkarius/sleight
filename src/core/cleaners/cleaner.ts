export type Cleaner<T> = {
  clean: (t: Readonly<T[]>) => T[];
};
