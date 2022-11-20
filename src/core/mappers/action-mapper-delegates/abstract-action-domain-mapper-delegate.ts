import { AbstractAction } from '../../../data/model/action/abstract-action';
import { DomainMapper } from '../mapper';

export abstract class AbstractActionDomainMapperDelegate {
  mapToDomainBase(dto: AbstractAction): AbstractAction {
    return {
      id: dto.id,
      name: dto.name,
      type: dto.type,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
    };
  }
  mapFromDomainBase(domain: AbstractAction): AbstractAction {
    return {
      id: domain.id,
      name: domain.name,
      type: domain.type,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
    };
  }
}
