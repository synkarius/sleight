type MustacheFn = (value: string, render: (value: string) => string) => string;
export const createMustacheFn = (fn: MustacheFn) => () => fn;

export const utilViewFunctions = {
  removeDashes: createMustacheFn((v, r) => r(v).replaceAll('-', '')),
  replaceNonAlphanum: createMustacheFn(
    (v, r) => (v && r(v).replaceAll(/[^a-zA-Z\d\s:]/g, '$')) || ''
  ),
  trim: createMustacheFn((v, r) => r(v).trim()),
};
