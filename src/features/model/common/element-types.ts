export namespace ElementType {
  export const Enum = {
    ACTION: 'Action',
    COMMAND: 'Command',
    CONTEXT: 'Context',
    ROLE_KEY: 'Role Key',
    SPEC: 'Spec',
    VARIABLE: 'Variable',
  } as const;
  export const values = () => [
    Enum.ACTION,
    Enum.COMMAND,
    Enum.CONTEXT,
    Enum.ROLE_KEY,
    Enum.SPEC,
    Enum.VARIABLE,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
