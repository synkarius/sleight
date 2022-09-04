import { MouseAction } from './mouse/mouse';
import { PauseAction } from './pause/pause';
import { SendKeyAction } from './send-key/send-key';

export type Action = MouseAction | PauseAction | SendKeyAction;
