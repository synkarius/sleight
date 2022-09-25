import { SelectorItem } from '../../data/model/selector/selector-domain';
import { SelectorItemDTO } from '../../data/model/selector/selector-dto';
import { DomainMapper } from './mapper';

export class DefaultSelectorItemDomainMapper
  implements DomainMapper<SelectorItem, SelectorItemDTO>
{
  mapToDomain(dto: SelectorItemDTO): SelectorItem {
    return {
      id: dto.id,
      value: dto.value,
    };
  }
  mapFromDomain(domain: SelectorItem): SelectorItemDTO {
    return {
      id: domain.id,
      value: domain.value,
    };
  }
}
