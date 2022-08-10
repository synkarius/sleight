export namespace MouseActionType {
  export const Enum = {
    MOVE: 'Move',
    PRESS: 'Press',
    HOLD_RELEASE: 'Hold/Release',
  } as const;
  export const values = () => [Enum.MOVE, Enum.PRESS, Enum.HOLD_RELEASE];
  export type Type = typeof Enum[keyof typeof Enum];
}
