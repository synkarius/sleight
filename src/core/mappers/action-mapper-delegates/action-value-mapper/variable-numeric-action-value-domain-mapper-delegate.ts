import { VariableRangeActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class VariableNumericActionValueDomainMapperDelegate
  implements DomainMapper<VariableRangeActionValue, VariableRangeActionValue>
{
  mapToDomain(dto: VariableRangeActionValue) {
    return {
      actionValueType: dto.actionValueType,
      variableType: dto.variableType,
      variableId: dto.variableId,
    };
  }
  mapFromDomain(domain: VariableRangeActionValue) {
    return {
      actionValueType: domain.actionValueType,
      variableType: domain.variableType,
      variableId: domain.variableId,
    };
  }
}
