import { Action } from '../../../data/model/action/action';
import { Maybe } from '../../common/maybe';

export type ActionDomainMapperDelegate = {
  mapToDomain: (dto: Action) => Maybe<Action>;
  mapFromDomain: (domain: Action) => Maybe<Action>;
};
