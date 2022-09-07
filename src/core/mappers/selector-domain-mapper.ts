import { DomainMapper } from './mapper';
import { Selector } from '../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { getSelectorItemDomainMapper } from './selector-item-domain-mapper';

export const getSelectorDomainMapper: () => DomainMapper<
  Selector,
  SelectorDTO
> = () => {
  const selectorItemMapper = getSelectorItemDomainMapper();
  return {
    mapToDomain: (dto) => ({
      id: dto.id,
      items: dto.items.map((item) => selectorItemMapper.mapToDomain(item)),
    }),
    mapFromDomain: (domain) => ({
      id: domain.id,
      items: domain.items.map((item) => selectorItemMapper.mapFromDomain(item)),
    }),
  };
};
