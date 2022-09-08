import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { getSendKeyDomainMapperDelegate } from './send-key-action-domain-mapper-delegate';

export const getActionDomainMapperDelegates =
  (): ActionDomainMapperDelegate[] => [getSendKeyDomainMapperDelegate()];
