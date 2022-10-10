import { EnterTextActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class EnterTextActionValueDomainMapperDelegate
  implements DomainMapper<EnterTextActionValue, EnterTextActionValue>
{
  mapToDomain(dto: EnterTextActionValue) {
    return {
      actionValueType: dto.actionValueType,
      enteredValueType: dto.enteredValueType,
      value: dto.value,
    };
  }
  mapFromDomain(domain: EnterTextActionValue) {
    return {
      actionValueType: domain.actionValueType,
      enteredValueType: domain.enteredValueType,
      value: domain.value,
    };
  }
}
