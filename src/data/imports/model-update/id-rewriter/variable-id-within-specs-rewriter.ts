import { SleightDataInternalFormat } from '../../../data-formats';
import { SpecItemType } from '../../../model/spec/spec-item-type';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

/** Rewrites a variable's id within specs which use that variable. */
export class VariableIdWithinSpecsRewriter implements IdRewriter<VariableDTO> {
  rewriteId(
    variable: VariableDTO,
    newId: string,
    data: SleightDataInternalFormat
  ) {
    const oldId = variable.id;

    const specs = Object.values(data.specs)
      .map((spec) => {
        return {
          ...spec,
          items: spec.items.map((item) => {
            if (
              item.itemType === SpecItemType.Enum.VARIABLE &&
              item.itemId === oldId
            ) {
              return {
                ...item,
                itemId: newId,
              };
            }
            return item;
          }),
        };
      })
      .reduce(reduceIded, {});

    return {
      ...data,
      specs,
    };
  }
}
