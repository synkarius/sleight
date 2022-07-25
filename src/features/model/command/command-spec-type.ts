export namespace CommandSpecType {
  export const Enum = {
    VARIABLE: 'Variable',
    ROLE_KEY: 'Role Key',
  } as const;
  export const values = () => [Enum.VARIABLE, Enum.ROLE_KEY];
  export type Type = typeof Enum[keyof typeof Enum];
}
