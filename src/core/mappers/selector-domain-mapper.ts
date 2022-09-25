import { DomainMapper } from './mapper';
import {
  Selector,
  SelectorItem,
} from '../../data/model/selector/selector-domain';
import {
  SelectorDTO,
  SelectorItemDTO,
} from '../../data/model/selector/selector-dto';

export class DefaultSelectorDomainMapper
  implements DomainMapper<Selector, SelectorDTO>
{
  constructor(
    private selectorItemDomainMapper: DomainMapper<
      SelectorItem,
      SelectorItemDTO
    >
  ) {}

  mapToDomain(dto: SelectorDTO): Selector {
    return {
      id: dto.id,
      items: dto.items.map((item) =>
        this.selectorItemDomainMapper.mapToDomain(item)
      ),
    };
  }

  mapFromDomain(domain: Selector): SelectorDTO {
    return {
      id: domain.id,
      items: domain.items.map((item) =>
        this.selectorItemDomainMapper.mapFromDomain(item)
      ),
    };
  }
}
