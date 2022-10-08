export namespace FnType {
  export const Enum = {
    PYTHON: 'Python',
  } as const;
  export const values = () => [Enum.PYTHON];
  export type Type = typeof Enum[keyof typeof Enum];
}
