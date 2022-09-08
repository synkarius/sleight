import { AbstractAction } from '../../../data/model/action/abstract-action';
import { DomainMapper } from '../mapper';

export const getAbstractActionDomainMapperDelegate = (): DomainMapper<
  AbstractAction,
  AbstractAction
> => ({
  mapToDomain: (dto: AbstractAction): AbstractAction => {
    return {
      id: dto.id,
      name: dto.name,
      type: dto.type,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
    };
  },
  mapFromDomain: (domain: AbstractAction): AbstractAction => {
    return {
      id: domain.id,
      name: domain.name,
      type: domain.type,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
    };
  },
});
