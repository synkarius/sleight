import { Action } from '../../data/model/action/action';
import { Tokens } from '../../di/config/brandi-tokens';
import { MissingDelegateError } from '../../error/missing-delegate-error';
import { isDefined } from '../common/common-functions';
import { ActionDomainMapperDelegate } from './action-mapper-delegates/action-domain-mapper-delegate';
import { getActionDomainMapperDelegates } from './action-mapper-delegates/action-domain-mapper-delegates';
import { DomainMapper } from './mapper';

export class DelegatingActionDomainMapper
  implements DomainMapper<Action, Action>
{
  constructor(private delegates: ActionDomainMapperDelegate[]) {}

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
