export class SendKeyMode {
  static readonly PRESS = 'Press';
  static readonly HOLD_RELEASE = 'Hold/Release';
  static readonly values = () => [SendKeyMode.PRESS, SendKeyMode.HOLD_RELEASE];
}
