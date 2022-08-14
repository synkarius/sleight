import { ExhaustivenessFailureError } from '../../../../error/ExhaustivenessFailureError';
import { SpecItemType } from '../spec-item-type';
import { SpecItem } from './spec-domain';
import { SpecItemDTO } from './spec-dto';
import { SelectorDTO } from '../../selector/data/selector-dto';
import { getSelectorDomainMapper } from '../../selector/data/selector-domain-mapper';

interface SpecItemDomainMapper {
  mapToDomain: (
    specItem: SpecItemDTO,
    selectorDtos: Readonly<Record<string, SelectorDTO>>
  ) => SpecItem;
  mapFromDomain: (specItem: SpecItem) => SpecItemDTO;
}

export const getSpecItemDomainMapper: () => SpecItemDomainMapper = () => {
  const selectorDomainMapper = getSelectorDomainMapper();
  return {
    mapToDomain: (dto, selectorDtos) => {
      switch (dto.itemType) {
        case SpecItemType.Enum.SELECTOR:
          return {
            id: dto.id,
            itemType: SpecItemType.Enum.SELECTOR,
            selector: selectorDomainMapper.mapToDomain(
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
    },

    mapFromDomain: (domain) => {
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
    },
  };
};
