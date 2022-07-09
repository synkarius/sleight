import { SELECT_DEFAULT_VALUE } from '../features/model/common/consts';

type Predicate<T> = (value: T) => boolean;

export const noSelection: Predicate<string> = (id: string) =>
  id !== SELECT_DEFAULT_VALUE;

export const notEmpty: Predicate<string> = (value: string) =>
  value.trim().length > 0;
