import { Context } from '../../data/model/context/context';
import { DomainMapper } from './mapper';

export const getContextDomainMapper = (): DomainMapper<Context, Context> => {
  return {
    mapToDomain: (dto) => ({
      id: dto.id,
      name: dto.name,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      type: dto.type,
      matcher: dto.matcher,
    }),
    mapFromDomain: (domain) => ({
      id: domain.id,
      name: domain.name,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      type: domain.type,
      matcher: domain.matcher,
    }),
  };
};
