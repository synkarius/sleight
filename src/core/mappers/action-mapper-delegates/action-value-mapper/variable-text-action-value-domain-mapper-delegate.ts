import { VariableTextActionValue } from '../../../../data/model/action/action-value';
import { DomainMapper } from '../../mapper';

export const getVariableTextActionValueDomainMapperDelegate = (): DomainMapper<
  VariableTextActionValue,
  VariableTextActionValue
> => {
  return {
    mapToDomain: (dto) => {
      return {
        actionValueType: dto.actionValueType,
        variableType: dto.variableType,
        variableId: dto.variableId,
      };
    },
    mapFromDomain: (domain) => {
      return {
        actionValueType: domain.actionValueType,
        variableType: domain.variableType,
        variableId: domain.variableId,
      };
    },
  };
};
