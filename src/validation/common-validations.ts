import { SELECT_DEFAULT_VALUE } from '../features/model/common/consts';

type Predicate<T> = (value: T) => boolean;

export const noSelectionPredicate: Predicate<string> = (id: string) =>
  id !== SELECT_DEFAULT_VALUE;

export const notEmpty = (value: string) => value.trim().length > 0;

export const notEmptyPredicate: Predicate<string> = (value: string) =>
  notEmpty(value);

export const alwaysTrue = <T>(t: T): boolean => true;
