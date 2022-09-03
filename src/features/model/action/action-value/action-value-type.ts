/**
 * ActionValueType is how a value gets assigned to an action:
 * - ENTER_VALUE: the value is hardcoded
 * - USE_VARIABLE: the value is assigned from a variable
 */
export namespace ActionValueType {
  export const Enum = {
    ENTER_VALUE: 'Enter Value',
    USE_VARIABLE: 'Use Variable',
  } as const;
  export const values = () => [Enum.ENTER_VALUE, Enum.USE_VARIABLE];
  export type Type = typeof Enum[keyof typeof Enum];
}
