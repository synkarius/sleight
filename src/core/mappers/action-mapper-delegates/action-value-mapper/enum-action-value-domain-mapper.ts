import { EnumActionValue } from '../../../../data/model/action/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { DomainMapper } from '../../mapper';
import { getEnterEnumActionValueDomainMapperDelegate } from './enter-enum-action-value-domain-mapper-delegate';
import { getVariableEnumActionValueDomainMapperDelegate } from './variable-enum-action-value-domain-mapper-delegate';

export const getEnumActionValueDomainMapper = (): DomainMapper<
  EnumActionValue,
  EnumActionValue
> => {
  const enterValueDelegate = getEnterEnumActionValueDomainMapperDelegate();
  const variableDelegate = getVariableEnumActionValueDomainMapperDelegate();
  return {
    mapToDomain: (dto) => {
      return dto.actionValueType === ActionValueType.Enum.ENTER_VALUE
        ? enterValueDelegate.mapToDomain(dto)
        : variableDelegate.mapToDomain(dto);
    },
    mapFromDomain: (domain) => {
      return domain.actionValueType === ActionValueType.Enum.ENTER_VALUE
        ? enterValueDelegate.mapFromDomain(domain)
        : variableDelegate.mapFromDomain(domain);
    },
  };
};
