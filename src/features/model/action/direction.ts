export namespace Direction {
  export const Enum = {
    UP: 'Up',
    DOWN: 'Down',
  } as const;
  export const values = () => [Enum.UP, Enum.DOWN];
  export type Type = typeof Enum[keyof typeof Enum];
}
