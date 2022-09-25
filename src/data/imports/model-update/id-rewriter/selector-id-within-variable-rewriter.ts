import { SleightDataInternalFormat } from '../../../data-formats';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { isChoiceVariableDTO } from '../../../model/variable/variable-dto';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

export class SelectorIdWithinVariableIdRewriter
  implements IdRewriter<SelectorDTO>
{
  rewriteId(
    selector: SelectorDTO,
    newId: string,
    data: SleightDataInternalFormat
  ) {
    const oldId = selector.id;

    const variables = Object.values(data.variables)
      .filter(isChoiceVariableDTO)
      .map((variable) => ({
        ...variable,
        items: variable.items.map((item) => {
          if (item.selectorId === oldId) {
            return {
              ...item,
              selectorId: newId,
            };
          }
          return item;
        }),
      }))
      .reduce(reduceIded, {});

    return { ...data, variables };
  }
}
