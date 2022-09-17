// using an enum-like because actual TypeScript enums are not typesafe
export namespace VariableType {
  export const Enum = {
    TEXT: 'Text',
    NUMBER: 'Range',
    ENUM: 'Choice',
  } as const;
  export const values = () => [Enum.TEXT, Enum.NUMBER, Enum.ENUM];
  export type Type = typeof Enum[keyof typeof Enum];
}
