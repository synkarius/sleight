import {
  createSleightDataInternalFormat,
  SleightDataInternalFormat,
} from '../../../data/data-formats';
import { Action } from '../../../data/model/action/action';
import { Command, createCommand } from '../../../data/model/command/command';
import {
  createSelectorItem,
  Selector,
} from '../../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import {
  createSpec,
  createSpecItem,
  SelectorSpecItem,
  Spec,
} from '../../../data/model/spec/spec-domain';
import { Spell } from '../../../data/wizard/spell';
import { isIdSelected } from '../../common/common-functions';
import { Maybe, none, some } from '../../common/maybe';
import { DomainMapper } from '../mapper';
import { SpecDomainMapper } from '../spec-domain-mapper';
import { SpellData } from './spell-data';
import { SpellMapper } from './spell-mapper';

export abstract class AbstractSpellMapper<S extends Spell>
  implements SpellMapper<S>
{
  constructor(
    private actionMapper: DomainMapper<Action, Action>,
    private commandMapper: DomainMapper<Command, Command>,
    private specMapper: SpecDomainMapper,
    private selectorMapper: DomainMapper<Selector, SelectorDTO>
  ) {}
  abstract mapSpell(spell: S): Maybe<SpellData>;

  mapSpellParts(
    contextId: string,
    selectorText: string,
    action: Action
  ): Maybe<SpellData> {
    if (selectorText.length) {
      // spec
      const selectorSpecItem =
        this.createSelectorSpecItemWithValue(selectorText);
      const selector = selectorSpecItem.selector;
      const spec: Spec = {
        ...createSpec(),
        items: [selectorSpecItem],
      };

      // command
      const command: Command = {
        ...createCommand(),
        contextId: isIdSelected(contextId) ? contextId : undefined,
        specId: spec.id,
        actionIds: [action.id],
      };

      // data
      const data: SleightDataInternalFormat = {
        ...createSleightDataInternalFormat(),
        actions: { [action.id]: this.actionMapper.mapFromDomain(action) },
        commands: { [command.id]: this.commandMapper.mapFromDomain(command) },
        specs: { [spec.id]: this.specMapper.mapFromDomain(spec) },
        selectors: {
          [selector.id]: this.selectorMapper.mapFromDomain(selector),
        },
      };

      return some({ command, spec, action, data });
    }

    return none();
  }

  private createSelectorSpecItemWithValue(value: string): SelectorSpecItem {
    const selectorSpecItem: SelectorSpecItem = createSpecItem();
    const selectorItem = createSelectorItem();
    return {
      ...selectorSpecItem,
      selector: {
        ...selectorSpecItem.selector,
        items: [{ ...selectorItem, value }],
      },
    };
  }
}
