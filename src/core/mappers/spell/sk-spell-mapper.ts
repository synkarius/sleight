import { Action } from '../../../data/model/action/action';
import { createEnumValue } from '../../../data/model/action/action-value';
import {
  createSendKeyPressAction,
  SendKeyPressAction,
} from '../../../data/model/action/send-key/send-key';
import { Command } from '../../../data/model/command/command';
import { Selector } from '../../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import { Spec } from '../../../data/model/spec/spec-domain';
import { KeyPressSpell } from '../../../data/wizard/spell';
import { Namer } from '../../namers/namer';
import { DomainMapper } from '../mapper';
import { SpecDomainMapper } from '../spec-domain-mapper';
import { AbstractSpellMapper } from './abstract-spell-mapper';
import { SpellData } from './spell-data';

export class KeyPressSpellMapper extends AbstractSpellMapper<KeyPressSpell> {
  constructor(
    actionMapper: DomainMapper<Action, Action>,
    commandMapper: DomainMapper<Command, Command>,
    specMapper: SpecDomainMapper,
    selectorMapper: DomainMapper<Selector, SelectorDTO>,
    private actionNamer: Namer<Action>,
    commandNamer: Namer<Command>,
    specNamer: Namer<Spec>
  ) {
    super(
      actionMapper,
      commandMapper,
      specMapper,
      selectorMapper,
      commandNamer,
      specNamer
    );
  }

  mapSpell(spell: KeyPressSpell): SpellData {
    const skp = createSendKeyPressAction();
    const action: SendKeyPressAction = {
      ...skp,
      name: this.actionNamer.getName(skp),
      keyToSend: { ...createEnumValue(), value: spell.key },
    };

    return this.mapSpellParts(spell.contextId, spell.selector, action);
  }
}
