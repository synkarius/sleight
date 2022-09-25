import { Command } from '../../data/model/command/command';
import { DomainMapper } from './mapper';

export class DefaultCommandDomainMapper
  implements DomainMapper<Command, Command>
{
  mapToDomain(dto: Command): Command {
    return {
      id: dto.id,
      name: dto.name,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      contextId: dto.contextId,
      specId: dto.specId,
      actionIds: [...dto.actionIds],
    };
  }
  mapFromDomain(domain: Command): Command {
    return {
      id: domain.id,
      name: domain.name,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      contextId: domain.contextId,
      specId: domain.specId,
      actionIds: [...domain.actionIds],
    };
  }
}
