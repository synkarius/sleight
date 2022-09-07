import { SelectorItem } from '../../data/model/selector/selector-domain';
import { SelectorItemDTO } from '../../data/model/selector/selector-dto';
import { DomainMapper } from './mapper';

export const getSelectorItemDomainMapper = (): DomainMapper<
  SelectorItem,
  SelectorItemDTO
> => ({
  mapToDomain: (dto) => ({
    id: dto.id,
    value: dto.value,
  }),
  mapFromDomain: (domain) => ({
    id: domain.id,
    value: domain.value,
  }),
});
