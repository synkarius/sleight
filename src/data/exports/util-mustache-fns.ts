import { replaceNonAlphaNumeric } from '../../util/common-functions';

type MustacheFn = (value: string, render: (value: string) => string) => string;
export const createMustacheFn = (fn: MustacheFn) => () => fn;

export const utilViewFunctions = {
  removeDashes: createMustacheFn((v, r) => r(v).replaceAll('-', '')),
  replaceNonAlphanum: createMustacheFn(
    (v, r) => (v && replaceNonAlphaNumeric(r(v), '_')) || ''
  ),
  trim: createMustacheFn((v, r) => r(v).trim()),
};
