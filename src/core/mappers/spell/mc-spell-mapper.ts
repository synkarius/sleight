import { Action } from '../../../data/model/action/action';
import { createEnumValue } from '../../../data/model/action/action-value';
import {
  ClickMouseAction,
  createMouseClickAction,
} from '../../../data/model/action/mouse/mouse';
import { Command } from '../../../data/model/command/command';
import { Selector } from '../../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import { Spec } from '../../../data/model/spec/spec-domain';
import { ClickSpell } from '../../../data/wizard/spell';
import { Namer } from '../../namers/namer';
import { DomainMapper } from '../mapper';
import { SpecDomainMapper } from '../spec-domain-mapper';
import { AbstractSpellMapper } from './abstract-spell-mapper';
import { SpellData } from './spell-data';

export class ClickSpellMapper extends AbstractSpellMapper<ClickSpell> {
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

  mapSpell(spell: ClickSpell): SpellData {
    const mc = createMouseClickAction();
    const action: ClickMouseAction = {
      ...mc,
      name: this.actionNamer.getName(mc),
      mouseButton: { ...createEnumValue(), value: spell.button },
    };

    return this.mapSpellParts(spell.contextId, spell.selector, action);
  }
}
