import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { SpecItemType } from '../../data/model/spec/spec-item-type';
import { SpecItem } from '../../data/model/spec/spec-domain';
import { SpecItemDTO } from '../../data/model/spec/spec-dto';
import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { DomainMapper } from './mapper';
import { Selector } from '../../data/model/selector/selector-domain';

export type SpecItemDomainMapper = {
  mapToDomain: (
    specItem: SpecItemDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => SpecItem;
  mapFromDomain: (specItem: SpecItem) => SpecItemDTO;
};

export class DefaultSpecItemDomainMapper implements SpecItemDomainMapper {
  constructor(
    private selectorDomainMapper: DomainMapper<Selector, SelectorDTO>
  ) {}

  mapToDomain(
    dto: SpecItemDTO,
    selectorDtos: Record<string, SelectorDTO>
  ): SpecItem {
    switch (dto.itemType) {
      case SpecItemType.Enum.SELECTOR:
        return {
          id: dto.id,
          itemType: SpecItemType.Enum.SELECTOR,
          selector: this.selectorDomainMapper.mapToDomain(
            selectorDtos[dto.itemId]
          ),
          optional: dto.optional,
          grouped: dto.grouped,
        };
      case SpecItemType.Enum.VARIABLE:
        return {
          id: dto.id,
          itemType: SpecItemType.Enum.VARIABLE,
          variableId: dto.itemId,
          optional: dto.optional,
          grouped: dto.grouped,
        };
      default:
        throw new ExhaustivenessFailureError(dto.itemType);
    }
  }

  mapFromDomain(domain: SpecItem): SpecItemDTO {
    const itemType = domain.itemType;
    switch (itemType) {
      case SpecItemType.Enum.SELECTOR:
        return {
          id: domain.id,
          itemType: domain.itemType,
          itemId: domain.selector.id,
          optional: domain.optional,
          grouped: domain.grouped,
        };
      case SpecItemType.Enum.VARIABLE:
        return {
          id: domain.id,
          itemType: domain.itemType,
          itemId: domain.variableId,
          optional: domain.optional,
          grouped: domain.grouped,
        };
      default:
        throw new ExhaustivenessFailureError(itemType);
    }
  }
}
