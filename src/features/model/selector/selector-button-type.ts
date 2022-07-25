export namespace SelectorButtonType {
  export const Enum = {
    ADD_NEW: 'Add New',
    REMOVE: 'Remove',
  } as const;
  export const values = () => [Enum.ADD_NEW, Enum.REMOVE];
  export type Type = typeof Enum[keyof typeof Enum];
}
