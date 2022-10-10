import { Action } from '../../data/model/action/action';
import { ActionDomainMapperDelegateArray } from '../../di/di-collection-types';
import { MissingDelegateError } from '../../error/missing-delegate-error';
import { isDefined } from '../common/common-functions';
import { DomainMapper } from './mapper';

export class DelegatingActionDomainMapper
  implements DomainMapper<Action, Action>
{
  constructor(private delegates: ActionDomainMapperDelegateArray) {}

  mapToDomain(dto: Action): Action {
    const mapped = this.delegates
      .map((delegate) => delegate.mapToDomain(dto))
      .find(isDefined);
    if (mapped) {
      return mapped;
    }
    throw new MissingDelegateError('ActionDomainMapperDelegate');
  }

  mapFromDomain(domain: Action): Action {
    const mapped = this.delegates
      .map((delegate) => delegate.mapFromDomain(domain))
      .find(isDefined);
    if (mapped) {
      return mapped;
    }
    throw new MissingDelegateError('ActionDomainMapperDelegate');
  }
}
