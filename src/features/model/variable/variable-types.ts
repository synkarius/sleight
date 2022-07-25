// using an enum-like because actual TypeScript enums are not typesafe
export namespace VariableType {
  export const Enum = {
    TEXT: 'Text',
    RANGE: 'Range',
    CHOICE: 'Choice',
  } as const;
  export const values = () => [Enum.TEXT, Enum.RANGE, Enum.CHOICE];
  export type Type = typeof Enum[keyof typeof Enum];
}
