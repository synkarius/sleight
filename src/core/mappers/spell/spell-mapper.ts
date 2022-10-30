import { Spell } from '../../../data/wizard/spell';
import { Maybe } from '../../common/maybe';
import { SpellData } from './spell-data';

export type SpellMapper<S extends Spell> = {
  mapSpell: (spell: S) => Maybe<SpellData>;
};
