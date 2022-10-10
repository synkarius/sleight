import { EnterEnumActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class EnterEnumActionValueDomainMapperDelegate
  implements DomainMapper<EnterEnumActionValue, EnterEnumActionValue>
{
  mapToDomain(dto: EnterEnumActionValue) {
    return {
      actionValueType: dto.actionValueType,
      enteredValueType: dto.enteredValueType,
      value: dto.value,
    };
  }
  mapFromDomain(domain: EnterEnumActionValue) {
    return {
      actionValueType: domain.actionValueType,
      enteredValueType: domain.enteredValueType,
      value: domain.value,
    };
  }
}
