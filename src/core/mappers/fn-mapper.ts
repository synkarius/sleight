import { Fn, FnParameter } from '../../data/model/fn/fn';
import { DomainMapper } from './mapper';

export class DefaultFnMapper implements DomainMapper<Fn, Fn> {
  constructor(
    private parameterMapper: DomainMapper<FnParameter, FnParameter>
  ) {}

  mapToDomain(dto: Fn): Fn {
    return {
      id: dto.id,
      type: dto.type,
      name: dto.name,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      importTokens: dto.importTokens,
      parameters: dto.parameters.map((param) =>
        this.parameterMapper.mapToDomain(param)
      ),
    };
  }

  mapFromDomain(domain: Fn): Fn {
    return {
      id: domain.id,
      type: domain.type,
      name: domain.name,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      importTokens: domain.importTokens,
      parameters: domain.parameters.map((param) =>
        this.parameterMapper.mapToDomain(param)
      ),
    };
  }
}
