export namespace MouseMovementType {
  export const Enum = {
    ABSOLUTE: 'Absolute',
    RELATIVE: 'Relative',
    WINDOW: 'Window',
  } as const;
  export const values = () => [Enum.ABSOLUTE, Enum.RELATIVE, Enum.WINDOW];
  export type Type = typeof Enum[keyof typeof Enum];
}
