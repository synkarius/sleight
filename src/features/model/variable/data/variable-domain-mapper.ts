import { ReduxCopyFunction } from '../../../../data/wrap-redux-map';
import { ExhaustivenessFailureError } from '../../../../error/ExhaustivenessFailureError';
import { SelectorDTO } from '../../selector/data/selector-dto';
import { VariableType } from '../variable-types';
import { choiceVariableDomainMapperDelegate } from './choice-variable-domain-mapper';
import { rangeVariableDomainMapperDelegate } from './range-variable-domain-mapper';
import { textVariableDomainMapperDelegate } from './text-variable-domain-mapper-delegate';
import { Variable } from './variable';
import { VariableDTO } from './variable-dto';

export const variableDomainMapper = {
  mapToDomain: (
    dto: VariableDTO,
    selectorFn: ReduxCopyFunction<SelectorDTO>
  ): Variable => {
    const dtoType = dto.type;
    switch (dtoType) {
      case VariableType.Enum.TEXT:
        return textVariableDomainMapperDelegate.mapToDomain(dto);
      case VariableType.Enum.RANGE:
        return rangeVariableDomainMapperDelegate.mapToDomain(dto);
      case VariableType.Enum.CHOICE:
        return choiceVariableDomainMapperDelegate.mapToDomain(dto, selectorFn);
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
