export type MustacheFn = (
  value: string,
  render: (value: string) => string
) => string;

export const createMustacheFn = (fn: MustacheFn) => () => fn;
