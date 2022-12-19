import { SleightDataInternalFormat } from '../../../data-formats';
import { SpecItemType } from '../../../model/spec/spec-item-type';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

export class SelectorIdWithinSpecsIdRewriter implements IdRewriter {
  rewriteId(oldId: string, newId: string, data: SleightDataInternalFormat) {
    const specs = Object.values(data.specs)
      .map((spec) => ({
        ...spec,
        items: spec.items.map((item) => {
          if (
            item.itemType === SpecItemType.Enum.SELECTOR &&
            item.itemId === oldId
          ) {
            return {
              ...item,
              itemId: newId,
            };
          }
          return item;
        }),
      }))
      .reduce(reduceIded, {});

    return { ...data, specs };
  }
}
