export namespace CommandSpecType {
  export const Enum = {
    SPEC: 'Use Spec',
    ROLE_KEY: 'Use Role Key',
  } as const;
  export const values = () => [Enum.SPEC, Enum.ROLE_KEY];
  export type Type = typeof Enum[keyof typeof Enum];
}
