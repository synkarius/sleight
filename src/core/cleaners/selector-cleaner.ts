import { Selector } from '../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { DomainMapper } from '../mappers/mapper';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export class SelectorMappingCleaner implements Cleaner<SelectorDTO> {
  constructor(private selectorMapper: DomainMapper<Selector, SelectorDTO>) {}

  clean(selectors: Readonly<SelectorDTO[]>): SelectorDTO[] {
    return selectors
      .map((selectorDTO) => this.selectorMapper.mapToDomain(selectorDTO))
      .map((selector) => this.selectorMapper.mapFromDomain(selector));
  }
}
