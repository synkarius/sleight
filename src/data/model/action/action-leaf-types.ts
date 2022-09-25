/** There are actually 11 action types, not 8.
 * This enum should probably replace ActionType at some point.
 * That's a large undertaking though, and version breaking.
 */
export namespace ActionLeafType {
  export const Enum = {
    PAUSE: 'Pause',
    SEND_KEY_PRESS: 'Send Key Press',
    SEND_KEY_HOLD_RELEASE: 'Send Key Hold/Release',
    SEND_TEXT: 'Send Text',
    MOUSE_MOVE: 'Mouse Move',
    MOUSE_CLICK: 'Mouse Click',
    MOUSE_HOLD_RELEASE: 'Mouse Hold/Release',
    BRING_APP: 'Bring App',
    WAIT_FOR_WINDOW: 'Wait for Window',
    CALL_FUNCTION: 'Call Function',
    MIMIC: 'Mimic',
  } as const;
  export const values = () => [
    Enum.PAUSE,
    Enum.SEND_KEY_PRESS,
    Enum.SEND_KEY_HOLD_RELEASE,
    Enum.SEND_TEXT,
    Enum.MOUSE_MOVE,
    Enum.MOUSE_CLICK,
    Enum.MOUSE_HOLD_RELEASE,
    Enum.BRING_APP,
    Enum.WAIT_FOR_WINDOW,
    Enum.CALL_FUNCTION,
    Enum.MIMIC,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
