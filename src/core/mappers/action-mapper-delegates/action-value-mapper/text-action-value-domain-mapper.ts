import { TextActionValue } from '../../../../data/model/action/action-value/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value/action-value-type';
import { DomainMapper } from '../../mapper';
import { getEnterTextActionValueDomainMapperDelegate } from './enter-text-action-value-domain-mapper-delegate';
import { getVariableTextActionValueDomainMapperDelegate } from './variable-text-action-value-domain-mapper-delegate';

export const getTextActionValueDomainMapper = (): DomainMapper<
  TextActionValue,
  TextActionValue
> => {
  const enterValueDelegate = getEnterTextActionValueDomainMapperDelegate();
  const variableDelegate = getVariableTextActionValueDomainMapperDelegate();
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
