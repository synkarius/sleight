import { selectorDomainMapper } from '../../selector/data/selector-domain-mapper';
import { SelectorDTO } from '../../selector/data/selector-dto';
import { ChoiceItem, ChoiceVariable } from './variable';
import { ChoiceItemDTO, ChoiceVariableDTO } from './variable-dto';

const choiceItemDomainMapper = {
  mapFromDomain: (domain: ChoiceItem): ChoiceItemDTO => ({
    id: domain.id,
    roleKeyId: domain.roleKeyId,
    selectorId: domain.selector.id,
    value: domain.value,
  }),
  mapToDomain: (
    dto: ChoiceItemDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ): ChoiceItem => ({
    id: dto.id,
    roleKeyId: dto.roleKeyId,
    selector: selectorDomainMapper.mapToDomain(selectorDtos[dto.selectorId]),
    value: dto.value,
  }),
};

export const choiceVariableDomainMapperDelegate = {
  mapFromDomain: (domain: ChoiceVariable): ChoiceVariableDTO => ({
    id: domain.id,
    name: domain.name,
    type: domain.type,
    roleKeyId: domain.roleKeyId,
    items: domain.items.map((item) =>
      choiceItemDomainMapper.mapFromDomain(item)
    ),
  }),
  mapToDomain: (
    dto: ChoiceVariableDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ): ChoiceVariable => ({
    id: dto.id,
    name: dto.name,
    type: dto.type,
    roleKeyId: dto.roleKeyId,
    items: dto.items.map((item) =>
      choiceItemDomainMapper.mapToDomain(item, selectorDtos)
    ),
  }),
};
