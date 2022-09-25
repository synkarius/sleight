import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { ChoiceItem, ChoiceVariable } from '../../data/model/variable/variable';
import {
  ChoiceItemDTO,
  ChoiceVariableDTO,
} from '../../data/model/variable/variable-dto';
import { DomainMapper } from './mapper';
import { Selector } from '../../data/model/selector/selector-domain';

export type ChoiceItemDomainMapper = {
  mapFromDomain: (domain: ChoiceItem) => ChoiceItemDTO;
  mapToDomain: (
    dto: ChoiceItemDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => ChoiceItem;
};

export class DefaultChoiceItemDomainMapper implements ChoiceItemDomainMapper {
  constructor(private selectorMapper: DomainMapper<Selector, SelectorDTO>) {}

  mapFromDomain(domain: ChoiceItem): ChoiceItemDTO {
    return {
      id: domain.id,
      selectorId: domain.selector.id,
      value: domain.value,
    };
  }

  mapToDomain(
    dto: ChoiceItemDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ): ChoiceItem {
    return {
      id: dto.id,
      selector: this.selectorMapper.mapToDomain(selectorDtos[dto.selectorId]),
      value: dto.value,
    };
  }
}

export type ChoiceVariableDomainMapper = {
  mapFromDomain: (domain: ChoiceVariable) => ChoiceVariableDTO;
  mapToDomain: (
    dto: ChoiceVariableDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => ChoiceVariable;
};

export class DefaultChoiceVariableDomainMapper
  implements ChoiceVariableDomainMapper
{
  constructor(private choiceItemDomainMapper: ChoiceItemDomainMapper) {}

  mapFromDomain(domain: ChoiceVariable): ChoiceVariableDTO {
    return {
      id: domain.id,
      name: domain.name,
      type: domain.type,
      roleKey: domain.roleKey,
      enabled: domain.enabled,
      locked: domain.locked,
      items: domain.items.map((item) =>
        this.choiceItemDomainMapper.mapFromDomain(item)
      ),
      defaultValue: domain.defaultValue,
    };
  }

  mapToDomain(
    dto: ChoiceVariableDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ): ChoiceVariable {
    return {
      id: dto.id,
      name: dto.name,
      type: dto.type,
      roleKey: dto.roleKey,
      enabled: dto.enabled,
      locked: dto.locked,
      items: dto.items.map((item) =>
        this.choiceItemDomainMapper.mapToDomain(item, selectorDtos)
      ),
      defaultValue: dto.defaultValue,
    };
  }
}
