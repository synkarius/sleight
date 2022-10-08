export namespace ResourceType {
  export const Enum = {
    SELECTOR: 'Selector',
    FN: 'Function',
  } as const;
  export const values = () => [Enum.SELECTOR, Enum.FN];
  export type Type = typeof Enum[keyof typeof Enum];
}
