import { Action } from '../../data/model/action/action';
import { MissingDelegateError } from '../../error/missing-delegate-error';
import { isDefined } from '../common/common-functions';
import { getActionDomainMapperDelegates } from './action-mapper-delegates/action-domain-mapper-delegates';
import { DomainMapper } from './mapper';

export const getActionDomainMapper = (): DomainMapper<Action, Action> => {
  const delegates = getActionDomainMapperDelegates();
  return {
    mapToDomain: (dto) => {
      const mapped = delegates
        .map((delegate) => delegate.mapToDomain(dto))
        .find(isDefined);
      if (mapped) {
        return mapped;
      }
      throw new MissingDelegateError('ActionDomainMapperDelegate');
    },
    mapFromDomain: (domain) => {
      const mapped = delegates
        .map((delegate) => delegate.mapFromDomain(domain))
        .find(isDefined);
      if (mapped) {
        return mapped;
      }
      throw new MissingDelegateError('ActionDomainMapperDelegate');
    },
  };
};
