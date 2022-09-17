import { NumericActionValue } from '../../../../data/model/action/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { DomainMapper } from '../../mapper';

type T = NumericActionValue & {
  actionValueType: typeof ActionValueType.Enum.USE_VARIABLE;
};

export const getVariableNumericActionValueDomainMapperDelegate =
  (): DomainMapper<T, T> => {
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
