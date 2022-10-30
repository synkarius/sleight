export namespace SpellType {
  export const Enum = {
    KEY_PRESS: 'keypress',
    TEXT: 'text',
    CLICK: 'click',
  } as const;
  export const values = () => [Enum.KEY_PRESS, Enum.TEXT, Enum.CLICK];
  export type Type = typeof Enum[keyof typeof Enum];
}
