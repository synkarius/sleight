export namespace SpecItemType {
  export const Enum = {
    SELECTOR: 'Selector',
    VARIABLE: 'Variable',
  } as const;
  export const values = () => [Enum.SELECTOR, Enum.VARIABLE];
  export type Type = typeof Enum[keyof typeof Enum];
}
