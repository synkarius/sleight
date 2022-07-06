export class ActionType {
  static readonly PAUSE = 'Pause';
  static readonly SEND_KEY = 'Send Key';
  static readonly SEND_TEXT = 'Send Text';
  static readonly MOUSE_CLICK = 'Mouse Click';
  static readonly BRING_APP = 'Bring App';
  static readonly WAIT_FOR_WINDOW = 'Wait for Window';
  static readonly CALL_FUNCTION = 'Call Function';
  static readonly MIMIC = 'Mimic';
  static readonly values = () => [
    ActionType.PAUSE,
    ActionType.SEND_KEY,
    ActionType.SEND_TEXT,
    ActionType.MOUSE_CLICK,
    ActionType.BRING_APP,
    ActionType.WAIT_FOR_WINDOW,
    ActionType.CALL_FUNCTION,
    ActionType.MIMIC,
  ];
}
