import { NumericActionValue } from '../../../../data/model/action/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { DomainMapper } from '../../mapper';
import { getEnterNumberActionValueDomainMapperDelegate } from './enter-numeric-action-value-domain-mapper-delegate';
import { getVariableNumericActionValueDomainMapperDelegate } from './variable-numeric-action-value-domain-mapper-delegate';

export const getNumericActionValueDomainMapper = (): DomainMapper<
  NumericActionValue,
  NumericActionValue
> => {
  const enterValueDelegate = getEnterNumberActionValueDomainMapperDelegate();
  const variableDelegate = getVariableNumericActionValueDomainMapperDelegate();
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
