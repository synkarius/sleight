import { ReduxCopyFunction } from '../../../../data/wrap-redux-map';
import { SelectorRedux } from '../../selector/data/selector-redux';
import { Spec } from './spec-domain';
import { specItemDomainMapper } from './spec-item-domain-mapper';
import { SpecRedux } from './spec-redux';

interface SpecDomainMapper {
  mapToDomain: (
    spec: SpecRedux,
    selectorFn: ReduxCopyFunction<SelectorRedux>
  ) => Spec;
  mapFromDomain: (spec: Spec) => SpecRedux;
}

export const specDomainMapper: SpecDomainMapper = {
  mapToDomain: (specRedux, selectorFn) => {
    return {
      id: specRedux.id,
      name: specRedux.name,
      roleKeyId: specRedux.roleKeyId,
      items: specRedux.items.map((item) =>
        specItemDomainMapper.mapToDomain(item, selectorFn)
      ),
    };
  },
  mapFromDomain: (domainSpec) => {
    return {
      id: domainSpec.id,
      name: domainSpec.name,
      roleKeyId: domainSpec.roleKeyId,
      items: domainSpec.items.map((dSpecItem) =>
        specItemDomainMapper.mapFromDomain(dSpecItem)
      ),
    };
  },
};
