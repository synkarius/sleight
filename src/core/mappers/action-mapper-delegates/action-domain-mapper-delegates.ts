import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { getPauseDomainMapperDelegate } from './pause-action-domain-mapper-delegate';
import { getSendKeyDomainMapperDelegate } from './send-key-action-domain-mapper-delegate';

export const getActionDomainMapperDelegates =
  (): ActionDomainMapperDelegate[] => [
    getPauseDomainMapperDelegate(),
    getSendKeyDomainMapperDelegate(),
  ];
