import { SleightDataInternalFormat } from '../../../data-formats';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { SpecItemType } from '../../../model/spec/spec-item-type';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

export class SelectorIdWithinSpecsIdRewriter
  implements IdRewriter<SelectorDTO>
{
  rewriteId(
    selector: SelectorDTO,
    newId: string,
    data: SleightDataInternalFormat
  ) {
    const oldId = selector.id;

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
