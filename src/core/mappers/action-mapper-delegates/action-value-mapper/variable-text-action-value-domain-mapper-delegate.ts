import { VariableTextActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class VariableTextActionValueDomainMapperDelegate
  implements DomainMapper<VariableTextActionValue, VariableTextActionValue>
{
  mapToDomain(dto: VariableTextActionValue) {
    return {
      id: dto.id,
      actionValueType: dto.actionValueType,
      variableType: dto.variableType,
      variableId: dto.variableId,
    };
  }
  mapFromDomain(domain: VariableTextActionValue) {
    return {
      id: domain.id,
      actionValueType: domain.actionValueType,
      variableType: domain.variableType,
      variableId: domain.variableId,
    };
  }
}
