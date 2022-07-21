import { SELECT_DEFAULT_VALUE } from '../features/model/common/consts';
import { notEmpty } from '../util/common-functions';

type Predicate<T> = (value: T) => boolean;

export const noSelectionPredicate: Predicate<string> = (id: string) =>
  id !== SELECT_DEFAULT_VALUE;

export const notEmptyPredicate: Predicate<string> = (value: string) =>
  notEmpty(value);
