import { SpellType } from './spell-types';

interface AbstractSpell {
  type: SpellType.Type;
  contextId: string;
  selector: string;
}

export interface KeyPressSpell extends AbstractSpell {
  type: typeof SpellType.Enum.KEY_PRESS;
  key: string;
}

export interface TextSpell extends AbstractSpell {
  text: string;
}

export interface ClickSpell extends AbstractSpell {
  button: string;
}

export type Spell = KeyPressSpell | TextSpell | ClickSpell;
