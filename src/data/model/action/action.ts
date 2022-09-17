import { BringAppAction } from './bring-app/bring-app';
import { CallFunctionAction } from './call-function/call-function';
import { MimicAction } from './mimic/mimic';
import { MouseAction } from './mouse/mouse';
import { PauseAction } from './pause/pause';
import { SendKeyAction } from './send-key/send-key';
import { SendTextAction } from './send-text/send-text';
import { WaitForWindowAction } from './wait-for-window/wait-for-window';

export type Action =
  | BringAppAction
  | CallFunctionAction
  | MimicAction
  | MouseAction
  | PauseAction
  | SendKeyAction
  | SendTextAction
  | WaitForWindowAction;
