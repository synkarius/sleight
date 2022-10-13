import { VariableRangeActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class VariableNumericActionValueDomainMapperDelegate
  implements DomainMapper<VariableRangeActionValue, VariableRangeActionValue>
{
  mapToDomain(dto: VariableRangeActionValue) {
    return {
      id: dto.id,
      actionValueType: dto.actionValueType,
      variableType: dto.variableType,
      variableId: dto.variableId,
    };
  }
  mapFromDomain(domain: VariableRangeActionValue) {
    return {
      id: domain.id,
      actionValueType: domain.actionValueType,
      variableType: domain.variableType,
      variableId: domain.variableId,
    };
  }
}
