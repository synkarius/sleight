import { Action } from '../../../data/model/action/action';
import { createTextValue } from '../../../data/model/action/action-value';
import {
  createSendTextAction,
  SendTextAction,
} from '../../../data/model/action/send-text/send-text';
import { Command } from '../../../data/model/command/command';
import { Selector } from '../../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import { Spec } from '../../../data/model/spec/spec-domain';
import { TextSpell } from '../../../data/wizard/spell';
import { Namer } from '../../namers/namer';
import { DomainMapper } from '../mapper';
import { SpecDomainMapper } from '../spec-domain-mapper';
import { AbstractSpellMapper } from './abstract-spell-mapper';
import { SpellData } from './spell-data';

export class TextSpellMapper extends AbstractSpellMapper<TextSpell> {
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

  mapSpell(spell: TextSpell): SpellData {
    const st = createSendTextAction();
    const action: SendTextAction = {
      ...st,
      name: this.actionNamer.getName(st),
      text: { ...createTextValue(), value: spell.text },
    };

    return this.mapSpellParts(spell.contextId, spell.selector, action);
  }
}
