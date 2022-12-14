import { TextVariable } from '../../data/model/variable/variable';
import { TextVariableDTO } from '../../data/model/variable/variable-dto';
import { DomainMapper } from './mapper';

export class DefaultTextVariableDomainMapper
  implements DomainMapper<TextVariable, TextVariableDTO>
{
  mapToDomain(dto: TextVariableDTO): TextVariable {
    return {
      id: dto.id,
      type: dto.type,
      name: dto.name,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      defaultValue: dto.defaultValue,
    };
  }
  mapFromDomain(domain: TextVariable): TextVariableDTO {
    return {
      id: domain.id,
      type: domain.type,
      name: domain.name,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      defaultValue: domain.defaultValue,
    };
  }
}
