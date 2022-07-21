import { SELECT_DEFAULT_VALUE } from '../features/model/common/consts';

export const alwaysTrue = <T>(t: T): boolean => true;

export const alwaysFalse = <T>(t: T): boolean => false;

export const notEmpty = (value: string) => value.trim().length > 0;

export const identity = <T>(t: T) => t;

export const isSelected = (id?: string): boolean =>
  !!id && id !== SELECT_DEFAULT_VALUE;
