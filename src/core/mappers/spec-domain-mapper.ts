import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { Spec } from '../../data/model/spec/spec-domain';
import { SpecItemDomainMapper } from './spec-item-domain-mapper';
import { SpecDTO } from '../../data/model/spec/spec-dto';

export type SpecDomainMapper = {
  mapToDomain: (
    specDto: SpecDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => Spec;
  mapFromDomain: (spec: Spec) => SpecDTO;
};

export class DefaultSpecDomainMapper implements SpecDomainMapper {
  constructor(private specItemDomainMapper: SpecItemDomainMapper) {}

  mapToDomain(dto: SpecDTO, selectorDtos: Record<string, SelectorDTO>): Spec {
    return {
      id: dto.id,
      name: dto.name,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      items: dto.items.map((item) =>
        this.specItemDomainMapper.mapToDomain(item, selectorDtos)
      ),
    };
  }
  mapFromDomain(domain: Spec): SpecDTO {
    return {
      id: domain.id,
      name: domain.name,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      items: domain.items.map((dSpecItem) =>
        this.specItemDomainMapper.mapFromDomain(dSpecItem)
      ),
    };
  }
}
