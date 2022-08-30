import { SELECT_DEFAULT_VALUE } from '../features/model/common/consts';

export const alwaysTrue = <T>(_t: T): boolean => true;

export const alwaysFalse = <T>(_t: T): boolean => false;

export const notEmpty = (value: string) => value.trim().length > 0;

export const isEmpty = (value: string) => value.trim().length === 0;

export const identity = <T>(t: T) => t;

export const notFalsy = (t: unknown) => !!t;

export const isDefined = <T>(t: T | undefined): t is T => t !== undefined;

export const singletonArray = <T>(t: T): T[] => [t];

export const listsIntersect = <T>(t1: T[], t2: T[]): boolean =>
  t1.filter((value) => t2.includes(value)).length > 0;

export type Predicate<T> = (t: T) => boolean;

export const not =
  <T>(predicate: Predicate<T>): Predicate<T> =>
  (t: T) =>
    !predicate(t);

export const isSelected = (id?: string): boolean =>
  !!id && id !== SELECT_DEFAULT_VALUE;

export const isTruthy = (t: any) => !!t;

export const replaceNonAlphaNumeric = (
  value: string,
  replacement: string
): string => value.replaceAll(/[^a-zA-Z\d]/g, replacement);
