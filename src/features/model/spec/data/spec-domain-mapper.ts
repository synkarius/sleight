import { ReduxCopyFunction } from '../../../../data/wrap-redux-map';
import { SelectorDTO } from '../../selector/data/selector-dto';
import { Spec } from './spec-domain';
import { specItemDomainMapper } from './spec-item-domain-mapper';
import { SpecDTO } from './spec-dto';

interface SpecDomainMapper {
  mapToDomain: (
    spec: SpecDTO,
    selectorFn: ReduxCopyFunction<SelectorDTO>
  ) => Spec;
  mapFromDomain: (spec: Spec) => SpecDTO;
}

export const specDomainMapper: SpecDomainMapper = {
  mapToDomain: (dto, selectorFn) => {
    return {
      id: dto.id,
      name: dto.name,
      roleKeyId: dto.roleKeyId,
      items: dto.items.map((item) =>
        specItemDomainMapper.mapToDomain(item, selectorFn)
      ),
    };
  },
  mapFromDomain: (domain) => {
    return {
      id: domain.id,
      name: domain.name,
      roleKeyId: domain.roleKeyId,
      items: domain.items.map((dSpecItem) =>
        specItemDomainMapper.mapFromDomain(dSpecItem)
      ),
    };
  },
};
