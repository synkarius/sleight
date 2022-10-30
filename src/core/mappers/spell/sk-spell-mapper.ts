import {
  createSleightDataInternalFormat,
  SleightDataInternalFormat,
} from '../../../data/data-formats';
import { Action } from '../../../data/model/action/action';
import { createEnumValue } from '../../../data/model/action/action-value';
import {
  createSendKeyPressAction,
  SendKeyPressAction,
} from '../../../data/model/action/send-key/send-key';
import { Command } from '../../../data/model/command/command';
import { Selector } from '../../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import { KeyPressSpell } from '../../../data/wizard/spell';
import { UNSELECTED_ENUM } from '../../common/consts';
import { Maybe } from '../../common/maybe';
import { DomainMapper } from '../mapper';
import { SpecDomainMapper } from '../spec-domain-mapper';
import { AbstractSpellMapper } from './abstract-spell-mapper';
import { SpellData } from './spell-data';

export class KeyPressSpellMapper extends AbstractSpellMapper<KeyPressSpell> {
  constructor(
    actionMapper: DomainMapper<Action, Action>,
    commandMapper: DomainMapper<Command, Command>,
    specMapper: SpecDomainMapper,
    selectorMapper: DomainMapper<Selector, SelectorDTO>
  ) {
    super(actionMapper, commandMapper, specMapper, selectorMapper);
  }

  mapSpell(spell: KeyPressSpell): Maybe<SpellData> {
    const action: SendKeyPressAction = {
      ...createSendKeyPressAction(),
      keyToSend: { ...createEnumValue(), value: spell.key },
    };

    return this.mapSpellParts(spell.contextId, spell.selector, action);
  }
}
