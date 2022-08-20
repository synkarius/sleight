import { getSelectorDomainMapper } from '../../selector/data/selector-domain-mapper';
import { SelectorDTO } from '../../selector/data/selector-dto';
import { ChoiceItem, ChoiceVariable } from './variable';
import { ChoiceItemDTO, ChoiceVariableDTO } from './variable-dto';

type ChoiceItemDomainMapper = {
  mapFromDomain: (domain: ChoiceItem) => ChoiceItemDTO;
  mapToDomain: (
    dto: ChoiceItemDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => ChoiceItem;
};

const getChoiceItemDomainMapper: () => ChoiceItemDomainMapper = () => {
  const selectorDomainMapper = getSelectorDomainMapper();
  return {
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
};

export type ChoiceVariableDomainMapper = {
  mapFromDomain: (domain: ChoiceVariable) => ChoiceVariableDTO;
  mapToDomain: (
    dto: ChoiceVariableDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => ChoiceVariable;
};

export const getChoiceVariableDomainMapper: () => ChoiceVariableDomainMapper =
  () => {
    const choiceItemDomainMapper = getChoiceItemDomainMapper();
    return {
      mapFromDomain: (domain: ChoiceVariable): ChoiceVariableDTO => ({
        id: domain.id,
        name: domain.name,
        type: domain.type,
        roleKeyId: domain.roleKeyId,
        items: domain.items.map((item) =>
          choiceItemDomainMapper.mapFromDomain(item)
        ),
        defaultItemIndex: domain.defaultItemIndex,
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
        defaultItemIndex: dto.defaultItemIndex,
      }),
    };
  };
