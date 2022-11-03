import { Action } from '../../data/model/action/action';
import { ActionDomainMapperDelegateArray } from '../../di/di-collection-types';
import { MissingDelegateError } from '../../error/missing-delegate-error';
import { isDefined } from '../common/common-functions';
import { findFirst } from '../common/lazy';
import { isSome } from '../common/maybe';
import { DomainMapper } from './mapper';

export class DelegatingActionDomainMapper
  implements DomainMapper<Action, Action>
{
  constructor(private delegates: ActionDomainMapperDelegateArray) {}

  mapToDomain(dto: Action): Action {
    const mapped = findFirst(this.delegates, (delegate) =>
      delegate.mapToDomain(dto)
    );
    if (isSome(mapped)) {
      return mapped.value;
    }
    throw new MissingDelegateError('ActionDomainMapperDelegate');
  }

  mapFromDomain(domain: Action): Action {
    const mapped = findFirst(this.delegates, (delegate) =>
      delegate.mapFromDomain(domain)
    );
    if (isSome(mapped)) {
      return mapped.value;
    }
    throw new MissingDelegateError('ActionDomainMapperDelegate');
  }
}
