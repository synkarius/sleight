import { Action } from '../../../data/model/action/action';

export type ActionDomainMapperDelegate = {
  mapToDomain: (dto: Action) => Action | undefined;
  mapFromDomain: (domain: Action) => Action | undefined;
};
