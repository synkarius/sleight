export namespace SpellPaths {
  export const Enum = {
    // root
    SPELLS: 'spells',
    // spells
    KEY_PRESS: 'keypress',
    TEXT: 'text',
    CLICK: 'click',
  } as const;
  export const values = () => [
    Enum.SPELLS,
    Enum.KEY_PRESS,
    Enum.TEXT,
    Enum.CLICK,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
