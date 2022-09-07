import { Action } from '../../data/model/action/action';
import { NotImplementedError } from '../../error/not-implemented-error';
import { DomainMapper } from './mapper';

export const getActionDomainMapper = (): DomainMapper<Action, Action> => {
  return {
    mapToDomain: (dto) => {
      // TODO
      throw new NotImplementedError('getActionDomainMapper');
    },
    mapFromDomain: (domain) => {
      throw new NotImplementedError('getActionDomainMapper');
    },
  };
};
