import { SelectorDTO } from '../../selector/data/selector-dto';
import { Spec } from './spec-domain';
import { getSpecItemDomainMapper } from './spec-item-domain-mapper';
import { SpecDTO } from './spec-dto';

export type SpecDomainMapper = {
  mapToDomain: (
    specDto: SpecDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => Spec;
  mapFromDomain: (spec: Spec) => SpecDTO;
};

export const getSpecDomainMapper: () => SpecDomainMapper = () => {
  const specItemDomainMapper = getSpecItemDomainMapper();
  return {
    mapToDomain: (dto, selectorDtos) => {
      return {
        id: dto.id,
        name: dto.name,
        roleKey: dto.roleKey,
        enabled: dto.enabled,
        locked: dto.locked,
        items: dto.items.map((item) =>
          specItemDomainMapper.mapToDomain(item, selectorDtos)
        ),
      };
    },
    mapFromDomain: (domain) => {
      return {
        id: domain.id,
        name: domain.name,
        roleKey: domain.roleKey,
        enabled: domain.enabled,
        locked: domain.locked,
        items: domain.items.map((dSpecItem) =>
          specItemDomainMapper.mapFromDomain(dSpecItem)
        ),
      };
    },
  };
};
