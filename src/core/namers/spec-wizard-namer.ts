import { Ided } from '../../data/model/domain';
import { isSelectorSpecItem, Spec } from '../../data/model/spec/spec-domain';
import { alwaysTrue } from '../common/common-functions';
import { Namer } from './namer';

export class SpecWizardNamer implements Namer<Spec> {
  constructor(private specDefaultNamer: Namer<Ided>) {}

  getName(spec: Spec): string {
    const unique = this.specDefaultNamer.getName(spec);
    const selector =
      spec.items
        .filter(isSelectorSpecItem)
        .map((specSelectorItem) => specSelectorItem.selector)
        .flatMap((selector) => selector.items)
        .map((selectorItem) => selectorItem.value)
        .find(alwaysTrue) ?? 'selector missing';

    return `WG Spec / '${selector}' / ${unique}`;
  }
}
