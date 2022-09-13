export namespace MouseActionType {
  export const Enum = {
    MOVE: 'Move',
    CLICK: 'Click',
    HOLD_RELEASE: 'Hold/Release',
  } as const;
  export const values = () => [Enum.MOVE, Enum.CLICK, Enum.HOLD_RELEASE];
  export type Type = typeof Enum[keyof typeof Enum];
}
