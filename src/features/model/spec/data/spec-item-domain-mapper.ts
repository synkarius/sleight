import { ExhaustivenessFailureError } from '../../../../error/ExhaustivenessFailureError';
import { SpecItemType } from '../spec-item-type';
import { SpecItem, SelectorSpecItem, VariableSpecItem } from './spec-domain';
import { SpecItemRedux } from './spec-redux';
import { SELECT_DEFAULT_VALUE } from '../../common/consts';
import { ReduxCopyFunction } from '../../../../data/wrap-redux-map';
import { SelectorRedux } from '../../selector/data/selector-redux';
import { selectorDomainMapper } from '../../selector/data/selector-domain-mapper';

interface SpecItemDomainMapper {
  mapToDomain: (
    specItem: SpecItemRedux,
    selectorFn: ReduxCopyFunction<SelectorRedux>
  ) => SpecItem;
  mapFromDomain: (specItem: SpecItem) => SpecItemRedux;
}

export const specItemDomainMapper: SpecItemDomainMapper = {
  mapToDomain: (pSpecItem, selectorFn) => {
    switch (pSpecItem.itemType) {
      case SpecItemType.Enum.SELECTOR:
        const selectorRedux = selectorFn(pSpecItem.itemId);
        return {
          id: pSpecItem.id,
          itemType: SpecItemType.Enum.SELECTOR,
          selector: selectorDomainMapper.mapToDomain(selectorRedux),
        };
      case SpecItemType.Enum.VARIABLE:
        return {
          id: pSpecItem.id,
          itemType: SpecItemType.Enum.VARIABLE,
          variableId: pSpecItem.itemId,
        };
      default:
        throw new ExhaustivenessFailureError(pSpecItem.itemType);
    }
  },

  mapFromDomain: (dSpecItem) => {
    const itemType = dSpecItem.itemType;
    switch (itemType) {
      case SpecItemType.Enum.SELECTOR:
        return {
          id: dSpecItem.id,
          itemType: dSpecItem.itemType,
          itemId:
            (dSpecItem as SelectorSpecItem).selector?.id ??
            SELECT_DEFAULT_VALUE,
        };
      case SpecItemType.Enum.VARIABLE:
        return {
          id: dSpecItem.id,
          itemType: dSpecItem.itemType,
          itemId:
            (dSpecItem as VariableSpecItem).variableId ?? SELECT_DEFAULT_VALUE,
        };
      default:
        throw new ExhaustivenessFailureError(itemType);
    }
  },
};
