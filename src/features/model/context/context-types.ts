export namespace ContextType {
  export const Enum = {
    EXECUTABLE_NAME: 'Executable Name',
    WINDOW_TITLE: 'Window Title',
  } as const;
  export const values = () => [Enum.EXECUTABLE_NAME, Enum.WINDOW_TITLE];
  export type Type = typeof Enum[keyof typeof Enum];
}
