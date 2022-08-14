import { ExhaustivenessFailureError } from '../../../../error/ExhaustivenessFailureError';
import { SelectorDTO } from '../../selector/data/selector-dto';
import { VariableType } from '../variable-types';
import { getChoiceVariableDomainMapper } from './choice-variable-domain-mapper';
import { getRangeVariableDomainMapper } from './range-variable-domain-mapper';
import { getTextVariableDomainMapper } from './text-variable-domain-mapper-delegate';
import { Variable } from './variable';
import { VariableDTO } from './variable-dto';

export type VariableDomainMapper = {
  mapToDomain: (
    dto: VariableDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => Variable;
  mapFromDomain: (domain: Variable) => VariableDTO;
};

export const getVariableDomainMapper: () => VariableDomainMapper = () => {
  const textVariableDomainMapperDelegate = getTextVariableDomainMapper();
  const rangeVariableDomainMapperDelegate = getRangeVariableDomainMapper();
  const choiceVariableDomainMapperDelegate = getChoiceVariableDomainMapper();
  return {
    mapToDomain: (
      dto: VariableDTO,
      selectorDtos: Readonly<Record<string, SelectorDTO>>
    ): Variable => {
      const dtoType = dto.type;
      switch (dtoType) {
        case VariableType.Enum.TEXT:
          return textVariableDomainMapperDelegate.mapToDomain(dto);
        case VariableType.Enum.RANGE:
          return rangeVariableDomainMapperDelegate.mapToDomain(dto);
        case VariableType.Enum.CHOICE:
          return choiceVariableDomainMapperDelegate.mapToDomain(
            dto,
            selectorDtos
          );
        default:
          throw new ExhaustivenessFailureError(dtoType);
      }
    },

    mapFromDomain: (domain: Variable): VariableDTO => {
      const domainType = domain.type;
      switch (domainType) {
        case VariableType.Enum.TEXT:
          return textVariableDomainMapperDelegate.mapFromDomain(domain);
        case VariableType.Enum.RANGE:
          return rangeVariableDomainMapperDelegate.mapFromDomain(domain);
        case VariableType.Enum.CHOICE:
          return choiceVariableDomainMapperDelegate.mapFromDomain(domain);
        default:
          throw new ExhaustivenessFailureError(domainType);
      }
    },
  };
};
