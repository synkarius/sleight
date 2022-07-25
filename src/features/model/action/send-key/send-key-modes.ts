export namespace SendKeyMode {
  export const Enum = {
    PRESS: 'Press',
    HOLD_RELEASE: 'Hold/Release',
  } as const;
  export const values = () => [Enum.PRESS, Enum.HOLD_RELEASE];
  export type Type = typeof Enum[keyof typeof Enum];
}
