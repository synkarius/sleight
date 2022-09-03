export namespace ElementType {
  export const Enum = {
    ACTION: 'Action',
    COMMAND: 'Command',
    CONTEXT: 'Context',
    SPEC: 'Spec',
    VARIABLE: 'Variable',
  } as const;
  export const values = () => [
    Enum.ACTION,
    Enum.COMMAND,
    Enum.CONTEXT,
    Enum.SPEC,
    Enum.VARIABLE,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
