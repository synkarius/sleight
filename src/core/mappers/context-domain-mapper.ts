import { Context } from '../../data/model/context/context';
import { DomainMapper } from './mapper';

export class DefaultContextDomainMapper
  implements DomainMapper<Context, Context>
{
  mapToDomain(dto: Context): Context {
    return {
      id: dto.id,
      name: dto.name,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      type: dto.type,
      matcher: dto.matcher,
    };
  }
  mapFromDomain(domain: Context): Context {
    return {
      id: domain.id,
      name: domain.name,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      type: domain.type,
      matcher: domain.matcher,
    };
  }
}
