import { VariableTextActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class VariableTextActionValueDomainMapperDelegate
  implements DomainMapper<VariableTextActionValue, VariableTextActionValue>
{
  mapToDomain(dto: VariableTextActionValue) {
    return {
      actionValueType: dto.actionValueType,
      variableType: dto.variableType,
      variableId: dto.variableId,
    };
  }
  mapFromDomain(domain: VariableTextActionValue) {
    return {
      actionValueType: domain.actionValueType,
      variableType: domain.variableType,
      variableId: domain.variableId,
    };
  }
}
