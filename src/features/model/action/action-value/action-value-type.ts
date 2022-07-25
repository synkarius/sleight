/**
 * ActionValueType is how a value gets assigned to an action:
 * - ENTER_VALUE: the value is hardcoded
 * - USE_VARIABLE: the value is assigned from a variable
 * - USE_ROLE_KEY: a variable is assigned from a role key
 */
export namespace ActionValueType {
  export const Enum = {
    ENTER_VALUE: 'Enter Value',
    USE_VARIABLE: 'Use Variable',
    USE_ROLE_KEY: 'Use Role Key',
  } as const;
  export const values = () => [
    Enum.ENTER_VALUE,
    Enum.USE_VARIABLE,
    Enum.USE_ROLE_KEY,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
