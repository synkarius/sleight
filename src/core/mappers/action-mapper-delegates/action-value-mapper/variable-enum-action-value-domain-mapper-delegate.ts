import { VariableEnumActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class VariableEnumActionValueDomainMapperDelegate
  implements DomainMapper<VariableEnumActionValue, VariableEnumActionValue>
{
  mapToDomain(dto: VariableEnumActionValue) {
    return {
      id: dto.id,
      actionValueType: dto.actionValueType,
      variableType: dto.variableType,
      variableId: dto.variableId,
    };
  }
  mapFromDomain(domain: VariableEnumActionValue) {
    return {
      id: domain.id,
      actionValueType: domain.actionValueType,
      variableType: domain.variableType,
      variableId: domain.variableId,
    };
  }
}
