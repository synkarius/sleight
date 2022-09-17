import { TextActionValue } from '../../../../data/model/action/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { DomainMapper } from '../../mapper';

type T = TextActionValue & {
  actionValueType: typeof ActionValueType.Enum.ENTER_VALUE;
};

export const getEnterTextActionValueDomainMapperDelegate = (): DomainMapper<
  T,
  T
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
