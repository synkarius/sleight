import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { VariableType } from '../../data/model/variable/variable-types';
import { ChoiceVariableDomainMapper } from './choice-variable-domain-mapper';
import {
  RangeVariable,
  TextVariable,
  Variable,
} from '../../data/model/variable/variable';
import {
  RangeVariableDTO,
  TextVariableDTO,
  VariableDTO,
} from '../../data/model/variable/variable-dto';
import { DomainMapper } from './mapper';

export type VariableDomainMapper = {
  mapToDomain: (
    dto: VariableDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => Variable;
  mapFromDomain: (domain: Variable) => VariableDTO;
};

export class DefaultVariableDomainMapper implements VariableDomainMapper {
  constructor(
    private textVariableMapperDelegate: DomainMapper<
      TextVariable,
      TextVariableDTO
    >,
    private rangeVariableMapperDelegate: DomainMapper<
      RangeVariable,
      RangeVariableDTO
    >,
    private choiceVariableMapperDelegate: ChoiceVariableDomainMapper
  ) {}

  mapToDomain(
    dto: VariableDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ): Variable {
    const dtoType = dto.type;
    switch (dtoType) {
      case VariableType.Enum.TEXT:
        return this.textVariableMapperDelegate.mapToDomain(dto);
      case VariableType.Enum.NUMBER:
        return this.rangeVariableMapperDelegate.mapToDomain(dto);
      case VariableType.Enum.ENUM:
        return this.choiceVariableMapperDelegate.mapToDomain(dto, selectorDtos);
      default:
        throw new ExhaustivenessFailureError(dtoType);
    }
  }

  mapFromDomain(domain: Variable): VariableDTO {
    const domainType = domain.type;
    switch (domainType) {
      case VariableType.Enum.TEXT:
        return this.textVariableMapperDelegate.mapFromDomain(domain);
      case VariableType.Enum.NUMBER:
        return this.rangeVariableMapperDelegate.mapFromDomain(domain);
      case VariableType.Enum.ENUM:
        return this.choiceVariableMapperDelegate.mapFromDomain(domain);
      default:
        throw new ExhaustivenessFailureError(domainType);
    }
  }
}
