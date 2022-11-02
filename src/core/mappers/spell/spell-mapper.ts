import { Spell } from '../../../data/wizard/spell';
import { SpellData } from './spell-data';

export type SpellMapper<S extends Spell> = {
  mapSpell: (spell: S) => SpellData;
};
