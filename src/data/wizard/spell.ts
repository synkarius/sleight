import { MouseKey } from '../model/action/mouse/mouse-key';
import { Key } from '../model/action/send-key/key';
import { SpellType } from './spell-types';

interface AbstractSpell {
  type: SpellType.Type;
  contextId: string;
  selector: string;
}

export interface KeyPressSpell extends AbstractSpell {
  type: typeof SpellType.Enum.KEY_PRESS;
  key: Key.Type;
}

export interface TextSpell extends AbstractSpell {
  text: string;
}

export interface ClickSpell extends AbstractSpell {
  button: MouseKey.Type;
}

export type Spell = KeyPressSpell | TextSpell | ClickSpell;
