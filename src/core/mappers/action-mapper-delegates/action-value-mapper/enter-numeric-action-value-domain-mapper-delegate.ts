import { EnterNumberActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export class EnterNumberActionValueDomainMapperDelegate
  implements DomainMapper<EnterNumberActionValue, EnterNumberActionValue>
{
  mapToDomain(dto: EnterNumberActionValue) {
    return {
      actionValueType: dto.actionValueType,
      enteredValueType: dto.enteredValueType,
      value: dto.value,
    };
  }
  mapFromDomain(domain: EnterNumberActionValue) {
    return {
      actionValueType: domain.actionValueType,
      enteredValueType: domain.enteredValueType,
      value: domain.value,
    };
  }
}
