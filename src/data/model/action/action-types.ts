export namespace ActionType {
  export const Enum = {
    PAUSE: 'Pause',
    SEND_KEY: 'Send Key',
    SEND_TEXT: 'Send Text',
    MOUSE: 'Mouse',
    BRING_APP: 'Bring App',
    WAIT_FOR_WINDOW: 'Wait for Window',
    CALL_FUNCTION: 'Call Function',
    MIMIC: 'Mimic',
  } as const;
  export const values = () => [
    Enum.PAUSE,
    Enum.SEND_KEY,
    Enum.SEND_TEXT,
    Enum.MOUSE,
    Enum.BRING_APP,
    Enum.WAIT_FOR_WINDOW,
    Enum.CALL_FUNCTION,
    Enum.MIMIC,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
