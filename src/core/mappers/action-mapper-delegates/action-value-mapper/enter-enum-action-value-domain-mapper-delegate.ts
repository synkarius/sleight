import { EnterEnumActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export const getEnterEnumActionValueDomainMapperDelegate = (): DomainMapper<
  EnterEnumActionValue,
  EnterEnumActionValue
> => {
  return {
    mapToDomain: (dto) => {
      return {
        actionValueType: dto.actionValueType,
        enteredValueType: dto.enteredValueType,
        value: dto.value,
      };
    },
    mapFromDomain: (domain) => {
      return {
        actionValueType: domain.actionValueType,
        enteredValueType: domain.enteredValueType,
        value: domain.value,
      };
    },
  };
};
