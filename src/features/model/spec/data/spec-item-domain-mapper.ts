import { ExhaustivenessFailureError } from '../../../../error/ExhaustivenessFailureError';
import { SpecItemType } from '../spec-item-type';
import { SpecItem } from './spec-domain';
import { SpecItemDTO } from './spec-dto';
import { ReduxCopyFunction } from '../../../../data/wrap-redux-map';
import { SelectorDTO } from '../../selector/data/selector-dto';
import { selectorDomainMapper } from '../../selector/data/selector-domain-mapper';

interface SpecItemDomainMapper {
  mapToDomain: (
    specItem: SpecItemDTO,
    selectorFn: ReduxCopyFunction<SelectorDTO>
  ) => SpecItem;
  mapFromDomain: (specItem: SpecItem) => SpecItemDTO;
}

export const specItemDomainMapper: SpecItemDomainMapper = {
  mapToDomain: (dto, selectorFn) => {
    switch (dto.itemType) {
      case SpecItemType.Enum.SELECTOR:
        const selectorDTO = selectorFn(dto.itemId);
        return {
          id: dto.id,
          itemType: SpecItemType.Enum.SELECTOR,
          selector: selectorDomainMapper.mapToDomain(selectorDTO),
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
