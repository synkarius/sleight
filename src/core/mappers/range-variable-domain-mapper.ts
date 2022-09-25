import { DomainMapper } from './mapper';
import { RangeVariable } from '../../data/model/variable/variable';
import { RangeVariableDTO } from '../../data/model/variable/variable-dto';

export class DefaultRangeVariableDomainMapper
  implements DomainMapper<RangeVariable, RangeVariableDTO>
{
  mapToDomain(dto: RangeVariableDTO): RangeVariable {
    return {
      id: dto.id,
      type: dto.type,
      name: dto.name,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      beginInclusive: dto.beginInclusive,
      endInclusive: dto.endInclusive,
      defaultValue: dto.defaultValue,
    };
  }
  mapFromDomain(domain: RangeVariable): RangeVariableDTO {
    return {
      id: domain.id,
      type: domain.type,
      name: domain.name,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      beginInclusive: domain.beginInclusive,
      endInclusive: domain.endInclusive,
      defaultValue: domain.defaultValue,
    };
  }
}
